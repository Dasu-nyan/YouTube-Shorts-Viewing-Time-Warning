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

    // 視聴時間を取得
    chrome.runtime.sendMessage({ type: "getCurrentTime" }, (response) => {
        if (response && response.currentTime !== undefined) {
            const formattedTime = formatTime(response.currentTime);
            timeDisplay.textContent = `視聴時間: ${formattedTime}`;
        } else {
            timeDisplay.textContent = "No viewing time recorded.";
        }
    });
});
