chrome.alarms.create("restAlarm", {
  delayInMinutes: 20,
  periodInMinutes: 20
});

let popupWindowId; // Store the ID of the popup window

function showPopupAlert() {
  const popupWidth = 500;
  const popupHeight = 400;

  chrome.windows.getCurrent(function (currentWindow) {
    const left = Math.round(currentWindow.left + (currentWindow.width - popupWidth) / 2);
    const top = Math.round(currentWindow.top + (currentWindow.height - popupHeight) / 2);

    chrome.windows.create({
      type: "popup",
      url: "alertwindow.html",
      width: popupWidth,
      height: popupHeight,
      left: left,
      top: top
    }, function (popupWindow) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return; // Handle the error gracefully
      }

      popupWindowId = popupWindow.id; // Store the ID of the popup window

      setTimeout(function () {
        // Check if the popup window still exists before attempting to close it
        chrome.windows.get(popupWindow.id, function (windowInfo) {
          if (chrome.runtime.lastError || !windowInfo) {
            console.log("Popup window not found or already closed.");
          } else {
            console.log("Removing popup window with ID: " + popupWindow.id);
            chrome.windows.remove(popupWindow.id);
          }
        });
      }, 20000); // 20000 milliseconds = 20 seconds
    });
  });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "restAlarm") {
    showPopupAlert(); // Show the centered popup when the alarm triggers
    
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Rest Your Eyes",
      message: "ถึงเวลาพักสายตาแล้ว !!"
    }, function (notificationId) {
      chrome.notifications.onClicked.addListener(function (clickedNotificationId) {
        if (clickedNotificationId === notificationId) {
          chrome.alarms.clear("restAlarm", function (wasCleared) {
            if (wasCleared) {
              chrome.alarms.create("restAlarm", {
                delayInMinutes: 20,
                periodInMinutes: 20
              });
            }
          });
          chrome.notifications.clear(notificationId);
          // Add any additional actions or functionality here
        }
      });
    });
  }
});
