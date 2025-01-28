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

// オプション画面での設定変更を監視
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateLimit") {
    limitInSeconds = message.limitInSeconds; // 新しい制限時間を反映
    console.log(`Limit time updated to: ${limitInSeconds} seconds`);
    sendResponse({ message: "Limit time updated successfully!" });
  } else if (message.type === "getCurrentTime") {
    sendResponse({ currentTime: timer });
  }
});

// タブが更新されたときのリスナー
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.startsWith("https://www.youtube.com/shorts/")) {
    if (!intervalId) {
      timer = 0; // 新しい視聴セッションの開始
      intervalId = setInterval(() => {
        timer++;
        console.log(`Timer: ${timer}s`);
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
