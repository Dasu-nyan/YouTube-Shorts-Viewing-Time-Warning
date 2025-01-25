document.addEventListener("DOMContentLoaded", () => {
  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const saveButton = document.getElementById("save");

  // ストレージから現在の設定を取得
  chrome.storage.sync.get(["limitInSeconds"], (result) => {
    const limitInSeconds = result.limitInSeconds || 10 * 60;
    const hours = Math.floor(limitInSeconds / 3600);
    const minutes = Math.floor((limitInSeconds % 3600) / 60);
    const seconds = limitInSeconds % 60;

    hoursInput.value = hours;
    minutesInput.value = minutes;
    secondsInput.value = seconds;
  });

  // 保存ボタンのクリックイベント
  saveButton.addEventListener("click", () => {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    const limitInSeconds = hours * 3600 + minutes * 60 + seconds;

    chrome.storage.sync.set({ limitInSeconds }, () => {
      alert("設定が保存されました！");
    });
  });
});
