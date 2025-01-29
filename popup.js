document.addEventListener("DOMContentLoaded", function () {
    const timeDisplay = document.getElementById("time-display");

    // 時間をフォーマットする関数
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let result = "";
        if (hours > 0) {
            result += `${hours}時間 `;
        }
        if (minutes > 0) {
            result += `${minutes}分 `;
        }
        result += `${remainingSeconds}秒`;

        return result;
    }

    // 視聴時間を取得して表示を更新する関数
    function updateTime() {
        chrome.runtime.sendMessage({ type: "getCurrentTime" }, (response) => {
            if (response && response.currentTime !== undefined) {
                timeDisplay.textContent = `視聴時間: ${formatTime(response.currentTime)}`;
            } else {
                timeDisplay.textContent = "No viewing time recorded.";
            }
        });
    }

    // 初回表示
    updateTime();

    // 1秒ごとに更新
    const intervalId = setInterval(updateTime, 1000);

    // ポップアップが閉じられたときに更新を停止
    window.addEventListener("unload", () => clearInterval(intervalId));
});
