document.addEventListener("DOMContentLoaded", function () {
    const timeDisplay = document.getElementById("time-display");

    // 視聴時間を取得
    chrome.runtime.sendMessage({ type: "getCurrentTime" }, (response) => {
        if (response && response.currentTime !== undefined) {
            timeDisplay.textContent = `Current viewing time: ${response.currentTime} seconds`;
        } else {
            timeDisplay.textContent = "No viewing time recorded.";
        }
    });
});
