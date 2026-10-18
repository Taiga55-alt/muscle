const calendar = document.getElementById("calendar");


// 現在表示している年月
let currentYear = 2026;
let currentMonth = 8;


// 保存されている記録
const records = JSON.parse(
    localStorage.getItem("records") || "{}"
);


// ====================
// 継続日数を計算する
// ====================

function calculateStreak(dateKey) {

    // その日に記録がなければ0日
    if (!records[dateKey]) {
        return 0;
    }

    let streak = 0;

    let date = new Date(dateKey);


    // 連続して記録されている日を調べる
    while (true) {

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const day =
            String(date.getDate()).padStart(2, "0");

        const key =
            `${year}-${month}-${day}`;


        // 記録がなければ終了
        if (!records[key]) {
            break;
        }


        // 記録があれば1日増やす
        streak++;


        // 1日前に移動
        date.setDate(date.getDate() - 1);
    }


    return streak;
}


// ====================
// 選択した日の情報を表示
// ====================

function showStats(dateKey) {

    const record = records[dateKey];


    // 記録がない日
    if (!record) {

        document.querySelector("#sleep .card-value").textContent =
            "-時間";

        document.querySelector("#protein .card-value").textContent =
            "-g";

        document.querySelector("#streak .card-value").textContent =
            "0日";

        document.querySelector("#sets .card-value").textContent =
            "-セット";

        return;
    }


    // 睡眠時間
    document.querySelector("#sleep .card-value").textContent =
        `${record.sleep}時間`;


    // プロテイン
    document.querySelector("#protein .card-value").textContent =
        `${record.protein}g`;


    // 継続日数
    const streak =
        calculateStreak(dateKey);

    document.querySelector("#streak .card-value").textContent =
        `${streak}日`;


    // セット数
    document.querySelector("#sets .card-value").textContent =
        `${record.sets}セット`;
}


// ====================
// カレンダーを表示
// ====================

function showCalendar() {

    const lastDay = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();


    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();


    calendar.innerHTML = `

        <div class="calendar-header">

            <button id="prev-month">←</button>

            <div class="calendar-title">
                ${currentYear}年${currentMonth + 1}月
            </div>

            <button id="next-month">→</button>

        </div>


        <div class="week">
            <div>日</div>
            <div>月</div>
            <div>火</div>
            <div>水</div>
            <div>木</div>
            <div>金</div>
            <div>土</div>
        </div>


        <div class="days" id="days"></div>
    `;


    const daysContainer =
        document.getElementById("days");


    // 1日より前の空白
    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        daysContainer.appendChild(empty);
    }


    // 日付を作る
    for (let day = 1; day <= lastDay; day++) {

        const button =
            document.createElement("button");

        button.classList.add("day");


        // 日付を「2026-09-04」にする
        const dateKey =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        // 記録している日なら虎
        if (records[dateKey]) {

            button.textContent =
                `🐯 ${day}`;

            button.classList.add("recorded");

        } else {

            button.textContent = day;

        }


        // 今日の日付
        const today = new Date();

        const todayKey =
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


        // 今日なら明るくする
        if (dateKey === todayKey) {

            button.classList.add("today");

        }


        // ====================
        // 日付をクリックしたとき
        // ====================

        button.addEventListener("click", function () {

            if (records[dateKey]) {

                // 記録済み
                // → 閲覧画面へ
                window.location.href =
                    `view.html?date=${dateKey}`;

            } else {

                // 未記録
                // → 新規記録画面へ
                window.location.href =
                    `record.html?date=${dateKey}`;

            }

        });


        daysContainer.appendChild(button);
    }


    // ====================
    // 前月
    // ====================

    document
        .getElementById("prev-month")
        .addEventListener("click", function () {

            currentMonth--;

            if (currentMonth < 0) {

                currentMonth = 11;
                currentYear--;

            }

            showCalendar();

        });


    // ====================
    // 次月
    // ====================

    document
        .getElementById("next-month")
        .addEventListener("click", function () {

            currentMonth++;

            if (currentMonth > 11) {

                currentMonth = 0;
                currentYear++;

            }

            showCalendar();

        });
}


// ====================
// 最初の表示
// ====================

showCalendar();


// 今日の情報を表示
const today = new Date();

const todayKey =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

showStats(todayKey);


// ====================
// 「記録する」ボタン
// ====================

const recordButton =
    document.getElementById("record-button");


recordButton.addEventListener("click", function () {

    // 今日の新規記録画面を開く
    window.location.href =
        "record.html";

});