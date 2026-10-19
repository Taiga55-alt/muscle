const calendar = document.getElementById("calendar");

// 現在表示している年月
let currentYear = 2026;
let currentMonth = 9;

// 保存されている記録
const records = JSON.parse(
    localStorage.getItem("records") || "{}"
);

// ========================================
// カレンダーを表示
// ========================================
function renderCalendar() {
    if (!calendar) return;

    calendar.innerHTML = "";

    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();

    const lastDate = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    const title = document.getElementById("month-title");

    if (title) {
        title.textContent =
            `${currentYear}年${currentMonth + 1}月`;
    }

    // 曜日
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    weekdays.forEach(day => {
        const div = document.createElement("div");
        div.textContent = day;
        div.classList.add("weekday");
        calendar.appendChild(div);
    });

    // 月初までの空白
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("empty");
        calendar.appendChild(empty);
    }

    // 日付
    for (let date = 1; date <= lastDate; date++) {
        const div = document.createElement("div");

        div.textContent = date;
        div.classList.add("day");

        const dateKey =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

        // 記録がある日
        if (records[dateKey]) {
            div.classList.add("has-record");
        }

        // 日付をクリックしたとき
        div.addEventListener("click", () => {
            showStats(dateKey);
        });

        calendar.appendChild(div);
    }
}

// ========================================
// 前の月
// ========================================
function prevMonth() {
    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
}

// ========================================
// 次の月
// ========================================
function nextMonth() {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}

// ========================================
// 記録を表示
// ========================================
function showStats(dateKey) {
    const stats = document.getElementById("stats");

    if (!stats) return;

    const record = records[dateKey];

    if (!record) {
        stats.textContent = `${dateKey}の記録はありません。`;
        return;
    }

    const heading = document.createElement("h3");
    heading.textContent = `${dateKey}の記録`;

    const workout = document.createElement("p");
    workout.textContent =
        `トレーニング内容：${record.workout || "未記入"}`;

    const protein = document.createElement("p");
    protein.textContent =
        `タンパク質摂取量：${record.protein || 0}g`;

    stats.replaceChildren(heading, workout, protein);
}

// ========================================
// API機能：外部からデータを取得する
// ========================================

// API機能の画面を作成
function createApiSection() {
    const section = document.createElement("section");

    section.id = "api-section";

    const heading = document.createElement("h2");
    heading.textContent = "APIデータ取得";

    const description = document.createElement("p");
    description.textContent =
        "外部サービスからデータを取得する機能です。";

    const button = document.createElement("button");
    button.id = "api-button";
    button.textContent = "APIからデータを取得";

    const status = document.createElement("p");
    status.id = "api-status";
    status.textContent = "ボタンを押すとデータを取得します。";

    const result = document.createElement("div");
    result.id = "api-result";

    section.append(
        heading,
        description,
        button,
        status,
        result
    );

    // カレンダーの後ろに追加
    if (calendar && calendar.parentElement) {
        calendar.parentElement.insertAdjacentElement(
            "afterend",
            section
        );
    } else {
        document.body.appendChild(section);
    }

    button.addEventListener("click", getApiData);
}

// APIからデータを取得
async function getApiData() {
    const button = document.getElementById("api-button");
    const status = document.getElementById("api-status");
    const result = document.getElementById("api-result");

    button.disabled = true;
    status.textContent = "APIにリクエストを送信しています...";
    result.replaceChildren();

    try {
        // ① 外部APIにデータを要求する
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1"
        );

        // ② HTTP通信が成功したか確認する
        if (!response.ok) {
            throw new Error(
                `HTTPエラー: ${response.status}`
            );
        }

        // ③ JSONをJavaScriptのデータに変換する
        const data = await response.json();

        // ④ 取得したデータを画面に表示する
        const title = document.createElement("h3");
        title.textContent = data.title;

        const body = document.createElement("p");
        body.textContent = data.body;

        result.append(title, body);

        status.textContent = "データの取得に成功しました。";

        // ⑤ 開発者ツールでもデータを確認できるようにする
        console.log("APIから取得したデータ:", data);

    } catch (error) {
        console.error("APIエラー:", error);

        status.textContent =
            "データの取得に失敗しました。通信環境を確認してください。";

    } finally {
        button.disabled = false;
    }
}

// ========================================
// ボタンのイベント設定
// ========================================

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

if (prevButton) {
    prevButton.addEventListener("click", prevMonth);
}

if (nextButton) {
    nextButton.addEventListener("click", nextMonth);
}

// ========================================
// 初期表示
// ========================================

renderCalendar();
createApiSection();