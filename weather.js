// 天気を表示する場所を作る
const weatherArea = document.createElement("section");
weatherArea.id = "weather";
weatherArea.innerHTML = `
    <h2>今日の天気</h2>
    <p>天気情報を取得中...</p>
`;

// ページに追加する
document.querySelector("main").appendChild(weatherArea);

// 東京の天気情報を取得する
async function getWeather() {
    try {
        const url =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=35.6895" +
            "&longitude=139.6917" +
            "&current=temperature_2m,relative_humidity_2m,weather_code" +
            "&timezone=Asia%2FTokyo";

        // APIにリクエストを送る
        const response = await fetch(url);

        // 通信が成功したか確認する
        if (!response.ok) {
            throw new Error("天気情報を取得できませんでした");
        }

        // 返ってきたJSONデータを読み取る
        const data = await response.json();

        // 必要なデータを取り出す
        const temperature = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;
        const weatherCode = data.current.weather_code;

        // 天気コードを日本語に変換する
        let weatherText = "不明";

        if (weatherCode === 0) {
            weatherText = "快晴";
        } else if ([1, 2, 3].includes(weatherCode)) {
            weatherText = "晴れ・曇り";
        } else if ([45, 48].includes(weatherCode)) {
            weatherText = "霧";
        } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
            weatherText = "霧雨";
        } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
            weatherText = "雨";
        } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
            weatherText = "雪";
        } else if ([95, 96, 99].includes(weatherCode)) {
            weatherText = "雷雨";
        }

        // 画面に表示する
        weatherArea.innerHTML = `
            <h2>今日の天気（東京）</h2>
            <p>天気：${weatherText}</p>
            <p>気温：${temperature}℃</p>
            <p>湿度：${humidity}%</p>
        `;

    } catch (error) {
        weatherArea.innerHTML = `
            <h2>今日の天気</h2>
            <p>天気情報を取得できませんでした。</p>
        `;

        console.error(error);
    }
}

// 実行する
getWeather();