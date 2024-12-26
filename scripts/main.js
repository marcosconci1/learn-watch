const DEBUG = false;

document.addEventListener("DOMContentLoaded", () => {
  if (DEBUG) console.log("Script initialized!"); // Verify the script is correctly loaded

  const minutesElement = document.querySelector("#time-display .minutes");
  const secondsElement = document.querySelector("#time-display .seconds");
  const progressCircle = document.querySelector("#progress-ring circle:last-child");

  const totalTime = 3600; // Total duration of one cycle in seconds
  count = parseInt(localStorage.getItem("count")) || 0; // Restore counter or initialize at 0
  isPaused = localStorage.getItem("isPaused") === "true" ? true : false; // Restore pause state
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // Calculate circle circumference for progress bar

  // Initialize progress bar appearance
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;
  updateStrokeColor(Math.floor(count / 60)); // Set initial progress bar color

  // Set initial timer display
  const minutes = Math.floor(count / 60);
  const seconds = count % 60;
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");

  // Pause/Play Button logic
  const pauseButton = document.getElementById("pauseButton");
  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    if (DEBUG) console.log("Pause state:", isPaused); // Log pause state
    pauseButton.querySelector(".material-icons").innerText = isPaused ? "play_arrow" : "pause";
  });

  // Reset Button logic
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    count = 0; // Reset the counter to 0
    isPaused = false; // Ensure the timer is running after reset
    progressCircle.style.strokeDashoffset = `${circumference}`; // Reset progress bar
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    if (DEBUG) console.log("Counter reset!"); // Confirm reset in debug mode
    pauseButton.querySelector(".material-icons").innerText = "pause"; // Set pause icon
    updateStrokeColor(0); // Reset progress bar color
  });

  // Timer update logic with precise elapsed time calculation
  let lastTimestamp = Date.now(); // Store initial timestamp
  function updateTimer() {
    if (!isPaused) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTimestamp) / 1000); // Calculate elapsed seconds

      if (elapsed > 0) {
        count += elapsed; // Increment counter by elapsed seconds
        lastTimestamp = now; // Update last timestamp

        // Update timer display
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

        // Update progress bar position
        const cycleTime = count % totalTime;
        const progress = cycleTime / totalTime;
        const offset = circumference - progress * circumference;
        progressCircle.style.strokeDashoffset = offset;

        updateStrokeColor(minutes); // Update progress bar color
      }
    }
    requestAnimationFrame(updateTimer); // Continuously update using requestAnimationFrame
  }

  updateTimer(); // Start timer loop

  // Save timer state before leaving the page
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("count", count); // Save counter value
    localStorage.setItem("isPaused", isPaused); // Save pause state
  });

  // Update progress bar color based on minutes passed
  function updateStrokeColor(minutes) {
    let baseGray = 0xDD - (minutes * 10); // Darken color every minute
    if (baseGray < 0x00) baseGray = 0x00; // Ensure the color doesn't turn fully black
    const grayHex = baseGray.toString(16).padStart(2, '0');
    const newColor = `#${grayHex}${grayHex}${grayHex}`;
    progressCircle.style.stroke = newColor; // Apply new color to progress bar
    if (DEBUG) console.log("Progress bar color updated:", newColor); // Log color update in debug mode
  }
});
