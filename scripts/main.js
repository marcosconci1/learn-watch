document.addEventListener("DOMContentLoaded", () => {
  console.log("Script initialized!"); // Check if the script is loading correctly

  const minutesElement = document.querySelector("#time-display .minutes");
  const secondsElement = document.querySelector("#time-display .seconds");
  const progressCircle = document.querySelector("#progress-ring circle:last-child");

  const totalTime = 3600; // Duration of one cycle (in seconds)
  let count = 0; // Total seconds counter
  let isPaused = false; // Initially paused
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // Circle circumference

  // Initial progress bar setup
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;
  // Initial progress bar color (light gray)
  updateStrokeColor(0);

  // Initialize the timer with 00:00
  minutesElement.textContent = "00";
  secondsElement.textContent = "00";

  // Pause/Play Button
  const pauseButton = document.getElementById("pauseButton");
  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    console.log("Pause state:", isPaused); // Verify pause state

    // Update Pause/Play button icon
    const icon = pauseButton.querySelector(".material-icons");
    icon.innerText = isPaused ? "play_arrow" : "pause";
  });

  // Reset Button
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    count = 0; // Reset total counter
    isPaused = false; // Do not pause the counter
    progressCircle.style.strokeDashoffset = `${circumference}`; // Reset progress bar
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    console.log("Counter reset!"); // Confirm reset

    // Update Pause button icon to "play_arrow"
    pauseButton.querySelector(".material-icons").innerText = "play_arrow";
    // Reset progress bar color
    updateStrokeColor(0);
  });

  // Update counter and progress bar
  setInterval(() => {
    if (!isPaused) {
      count++; // Increment total counter
      console.log("Counter updated:", count); // Log current counter value

      // Calculate minutes and seconds
      const minutes = Math.floor(count / 60);
      const seconds = count % 60;

      // Update DOM
      minutesElement.textContent = String(minutes).padStart(2, "0");
      secondsElement.textContent = String(seconds).padStart(2, "0");

      // Calculate progress within the current cycle
      const cycleTime = count % totalTime; // Time within the current cycle
      const progress = cycleTime / totalTime;
      const offset = circumference - progress * circumference;

      // Update progress bar
      progressCircle.style.strokeDashoffset = offset;
      console.log("Progress bar updated:", offset); // Log bar offset
      
      // Darken progress bar every minute
      const minutesPassed = Math.floor(count / 60);
      updateStrokeColor(minutesPassed);
    }
  }, 1000);

  // Function to update progress bar color based on minutes passed
  function updateStrokeColor(minutes) {
    let baseGray = 0xDD - (minutes * 10);
    if (baseGray < 0x00) baseGray = 0x00; // Prevent the color from becoming fully black
    
    const grayHex = baseGray.toString(16).padStart(2, '0');
    const newColor = `#${grayHex}${grayHex}${grayHex}`;
    progressCircle.style.stroke = newColor;
    console.log("Progress bar color updated:", newColor);
  }
});
