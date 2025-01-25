let timer = 0;
let intervalId = null;

// デフォルトの視聴制限時間（10分 = 600秒）
let limitInSeconds = 10 * 60;

// ストレージから設定を取得
chrome.storage.sync.get(["limitInSeconds"], (result) => {
  if (result.limitInSeconds) {
    limitInSeconds = result.limitInSeconds;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.startsWith("https://www.youtube.com/shorts/")) {
    if (!intervalId) {
      intervalId = setInterval(() => {
        timer++;
        if (timer >= limitInSeconds) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "視聴時間の警告",
            message: `YouTube Shortsを${Math.floor(limitInSeconds / 60)}分以上視聴しています！`
          });
          clearInterval(intervalId);
          intervalId = null;
          timer = 0;
        }
      }, 1000); // 1秒ごとにカウント
    }
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      timer = 0;
    }
  }
});

let viewingTime = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getCurrentTime") {
        sendResponse({ currentTime: timer });
    }
});
