let timer = 0;
let intervalId = null;

// デフォルトの視聴制限時間（10分 = 600秒）
let limitInSeconds = 10 * 60;
let currentTabId = null; // 現在対象のタブID

// ストレージから設定を取得
chrome.storage.sync.get(["limitInSeconds"], (result) => {
  if (result.limitInSeconds) {
    limitInSeconds = result.limitInSeconds;
  }
});

// オプション画面での設定変更を監視
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateLimit") {
    limitInSeconds = message.limitInSeconds;
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
      currentTabId = tabId; // 現在のタブIDを記録
      startTimer();
    }
  } else if (currentTabId === tabId) {
    // 対象のタブが閉じられた場合
    stopTimer();
  }
});

// タブが閉じられたときのリスナー
chrome.tabs.onRemoved.addListener((tabId) => {
  if (currentTabId === tabId) {
    stopTimer();
  }
});

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

// タイマーを開始する関数
function startTimer() {
  timer = 0; // タイマーリセット
  intervalId = setInterval(() => {
    // 現在のタブが存在しているか確認
    chrome.tabs.get(currentTabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        // タブが存在しない場合は停止
        stopTimer();
        return;
      }

      // タブが存在している場合のみタイマーを進める
      timer++;
      console.log(`Timer: ${timer}s`);
      if (timer >= limitInSeconds) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "視聴時間の警告",
          message: `YouTube Shortsを${formatTime(limitInSeconds)}以上視聴しています！`
        });
        timer = 0; // 通知後にリセット
      }
    });
  }, 1000); // 1秒ごとにカウント
}

// タイマーを停止する関数
function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    timer = 0; // タイマーリセット
    currentTabId = null; // タブIDリセット
  }
}
