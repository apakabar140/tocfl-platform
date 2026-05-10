// ================================================================
// TOCFL 練習平台 - Google Apps Script 後端
// 請將這整段程式碼貼到 Google Apps Script 並部署為 Web App
// ================================================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // 替換成你的 Google Sheet ID
const MEMBER_SHEET = '會員名單';               // 會員名單分頁名稱
const LOG_SHEET = '練習紀錄';                  // 練習紀錄分頁名稱

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  let result = {};

  if (data.action === 'login') {
    result = handleLogin(data);
  } else if (data.action === 'log') {
    result = handleLog(data);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 登入驗證 ──
function handleLogin(data) {
  const { passport, dob, nationality } = data;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(MEMBER_SHEET);

  if (!sheet) return { success: false, error: 'Sheet not found' };

  const rows = sheet.getDataRange().getValues();
  // 欄位順序：姓名, 護照號碼, 出生年月日, 國籍, 狀態
  for (let i = 1; i < rows.length; i++) {
    const [name, pass, dobCell, nat, status] = rows[i];
    const passMatch = String(pass).trim().toUpperCase() === String(passport).trim().toUpperCase();
    const dobFormatted = formatDob(dobCell);
    const dobMatch = dobFormatted === String(dob).trim().replace(/-/g, '');
    const active = String(status).trim() !== '停用';

    if (passMatch && dobMatch && active) {
      return { success: true, name: String(name).trim(), nationality: String(nat).trim() };
    }
  }
  return { success: false };
}

function formatDob(raw) {
  if (!raw) return '';
  if (raw instanceof Date) {
    const y = raw.getFullYear();
    const m = String(raw.getMonth()+1).padStart(2,'0');
    const d = String(raw.getDate()).padStart(2,'0');
    return `${y}${m}${d}`;  // YYYYMMDD format
  }
  // Handle string like "19950320" or "1995-03-20" -> normalize to YYYYMMDD
  const s = String(raw).trim().replace(/-/g, '');
  return s;
}

// ── 記錄答題 ──
function handleLog(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(LOG_SHEET);

  // 如果分頁不存在，建立並加上標題列
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET);
    sheet.appendRow(['時間', '護照號碼', '冊別', '題號', '部分', '選擇', '正確答案', '是否正確', '模式']);
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.passport,
    `第${data.vol}冊`,
    data.qnum,
    data.part,
    data.selected,
    data.correct,
    data.isCorrect ? '正確' : '錯誤',
    data.mode === 'mock' ? '模擬考試' : '練習模式',
  ]);

  return { success: true };
}
