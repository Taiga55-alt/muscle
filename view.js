// URLから日付を取得
const params = new URLSearchParams(window.location.search);
const selectedDate = params.get("date");

// 保存されている記録を取得
const records = JSON.parse(
    localStorage.getItem("records") || "{}"
);

// 選択した日の記録
const record = records[selectedDate];


// 記録がなければホームへ戻る
if (!record) {
    window.location.href = "index.html";
}


// 日付を表示
document.getElementById("date-title").textContent =
    `${selectedDate}の記録`;


// 記録の値を表示
document.getElementById("sleep-value").textContent =
    record.sleep;

document.getElementById("protein-value").textContent =
    record.protein;

document.getElementById("sets-value").textContent =
    record.sets;


// 継続日数を計算
function calculateStreak(dateKey) {

    let streak = 0;
    let date = new Date(dateKey);

    while (true) {

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const day =
            String(date.getDate()).padStart(2, "0");

        const key =
            `${year}-${month}-${day}`;

        if (!records[key]) {
            break;
        }

        streak++;

        date.setDate(
            date.getDate() - 1
        );
    }

    return streak;
}


const streak =
    calculateStreak(selectedDate);

document.getElementById("streak-value").textContent =
    `${streak}日`;


// 編集する
document.getElementById("edit-button")
    .addEventListener("click", function () {

        window.location.href =
            `record.html?date=${selectedDate}`;

    });


// 削除する
document.getElementById("delete-button")
    .addEventListener("click", function () {

        const result =
            confirm("この記録を削除しますか？");

        if (!result) {
            return;
        }

        delete records[selectedDate];

        localStorage.setItem(
            "records",
            JSON.stringify(records)
        );

        window.location.href =
            "index.html";
    });


// 戻る
document.getElementById("back-button")
    .addEventListener("click", function () {

        window.location.href =
            "index.html";

    });