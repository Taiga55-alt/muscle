// URLから日付を取得
const params = new URLSearchParams(window.location.search);
const selectedDate = params.get("date");


// 保存されている記録を取得
const records = JSON.parse(
    localStorage.getItem("records") || "{}"
);


// 選択した日の記録があれば入力欄に表示
if (selectedDate && records[selectedDate]) {

    document.getElementById("sleep-input").value =
        records[selectedDate].sleep;

    document.getElementById("protein-input").value =
        records[selectedDate].protein;

    document.getElementById("sets-input").value =
        records[selectedDate].sets;
}


// ====================
// 完了ボタン
// ====================

const completeButton =
    document.getElementById("complete-button");


completeButton.addEventListener("click", function () {

    // 入力された値を取得
    const sleep =
        document.getElementById("sleep-input").value;

    const protein =
        document.getElementById("protein-input").value;

    const sets =
        document.getElementById("sets-input").value;


    // 保存する日付
    const dateKey =
        selectedDate || getTodayKey();


    // 今までの記録を取得
    let records = JSON.parse(
        localStorage.getItem("records") || "{}"
    );


    // 記録を保存
    records[dateKey] = {
        sleep: sleep,
        protein: protein,
        sets: sets
    };


    // 保存
    localStorage.setItem(
        "records",
        JSON.stringify(records)
    );


    // 記録した日を取得
    let recordedDates = JSON.parse(
        localStorage.getItem("recordedDates") || "[]"
    );


    // 記録した日を追加
    if (!recordedDates.includes(dateKey)) {

        recordedDates.push(dateKey);

    }


    // 記録した日を保存
    localStorage.setItem(
        "recordedDates",
        JSON.stringify(recordedDates)
    );


    // ホームに戻る
    window.location.href = "index.html";

});


// ====================
// 削除ボタン
// ====================

const deleteButton =
    document.getElementById("delete-button");


deleteButton.addEventListener("click", function () {

    // 過去の日付が選択されていなければ削除しない
    if (!selectedDate) {
        return;
    }


    // 確認
    const result =
        confirm("この記録を削除しますか？");


    if (!result) {
        return;
    }


    // 保存されている記録を取得
    let records = JSON.parse(
        localStorage.getItem("records") || "{}"
    );


    // 選択した日の記録を削除
    delete records[selectedDate];


    // 保存
    localStorage.setItem(
        "records",
        JSON.stringify(records)
    );


    // 記録した日を取得
    let recordedDates = JSON.parse(
        localStorage.getItem("recordedDates") || "[]"
    );


    // 削除した日を記録一覧から削除
    recordedDates =
        recordedDates.filter(function (date) {

            return date !== selectedDate;

        });


    // 保存
    localStorage.setItem(
        "recordedDates",
        JSON.stringify(recordedDates)
    );


    // ホームに戻る
    window.location.href = "index.html";

});


// ====================
// 今日の日付を取得
// ====================

function getTodayKey() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}