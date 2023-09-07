function startTimer(duration, display) {
    var timer = duration;
    var interval = setInterval(function () {
      display.textContent = timer;

      if (--timer < 0) {
        clearInterval(interval); // Stop the interval when timer reaches 0
        display.textContent = "Time's up!";
      }
    }, 1000); // Update every second
  }

  // Start the countdown when the page loads
  window.onload = function () {
    var countdownDisplay = document.getElementById("countdown");
    var countdownDuration = 20; // 20 seconds
    startTimer(countdownDuration, countdownDisplay);
  };