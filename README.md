# TOCFL 聽力練習平台 | 部署說明

## 一、建立 Google Sheets 會員系統

### 步驟 1：建立 Google Sheets
1. 開啟 Google Sheets，新增一個試算表
2. 將第一個分頁命名為「**會員名單**」
3. 在第一列加入標題（從 A1 開始）：
   - A1：`姓名`
   - B1：`護照號碼`
   - C1：`出生年月日`（格式：YYYY-MM-DD，例如 1990-05-15）
   - D1：`國籍`（填 ID / VN / PH / TH）
   - E1：`狀態`（填「啟用」或「停用」）

4. 從第二列開始填入考生資料，例如：
   ```
   王小明  |  A1234567  |  1995-03-20  |  ID  |  啟用
   ```

5. 記下這個試算表的 **ID**（網址中 `/d/` 和 `/edit` 之間的那串字元）

---

### 步驟 2：設定 Apps Script
1. 在 Google Sheets 點選上方選單「**擴充功能 → Apps Script**」
2. 刪除預設的程式碼
3. 把 `apps_script.js` 裡的全部內容貼上
4. 把第 7 行的 `'YOUR_GOOGLE_SHEET_ID_HERE'` 換成步驟 1 記下的 ID
5. 點「**儲存**」（磁碟圖示）

### 步驟 3：部署 Apps Script
1. 點右上角「**部署 → 新增部署作業**」
2. 選擇類型：**網路應用程式**
3. 設定：
   - 執行身分：**我（你的 Google 帳號）**
   - 誰可以存取：**所有人**
4. 點「**部署**」
5. 複製出現的「**網路應用程式網址**」（長得像 `https://script.google.com/macros/s/...`）

---

## 二、上傳到 GitHub Pages

### 步驟 1：建立 Repository
1. 登入 GitHub（帳號：apakabar140）
2. 點右上角「**+**」→「**New repository**」
3. Repository name 填：`tocfl-platform`
4. 選「**Public**」
5. 點「**Create repository**」

### 步驟 2：修改設定
在上傳前，先用文字編輯器（記事本）開啟 `index.html`：
- 找到這行：`const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';`
- 把 `YOUR_APPS_SCRIPT_URL_HERE` 換成步驟 3 複製的網址
- 儲存檔案

### 步驟 3：上傳檔案
1. 在 GitHub 新建的 Repository 頁面，點「**uploading an existing file**」
2. 把整個資料夾的內容拖進去（所有檔案和資料夾）
   - `index.html`
   - `questions_db.json`
   - `part4_options.json`
   - `audio/` 資料夾（250 個 mp3）
   - `images/questions/` 資料夾（210 個 jpg）
3. 在下方填寫 Commit 說明：「初始上傳」
4. 點「**Commit changes**」

> ⚠️ 注意：音檔和圖片共約 300MB，上傳需要一些時間

### 步驟 4：開啟 GitHub Pages
1. 在 Repository 頁面點「**Settings**」
2. 左側選「**Pages**」
3. Source 選「**Deploy from a branch**」
4. Branch 選「**main**」，資料夾選「**/ (root)**」
5. 點「**Save**」
6. 等待 1-2 分鐘後，網址會顯示為：
   `https://apakabar140.github.io/tocfl-platform/`

---

## 三、查看練習紀錄

直接開啟 Google Sheets → 「練習紀錄」分頁，就能看到所有考生的答題資料。

可以用 Google Sheets 的篩選功能依照：
- 護照號碼（查看特定考生）
- 部分（查看哪個部分答錯最多）
- 是否正確（統計正確率）

---

## 四、日後新增會員

只需要在 Google Sheets「會員名單」分頁新增一列資料即可，不需要修改任何程式。
