const DEBUG = false;

document.addEventListener("DOMContentLoaded", () => {
  if (DEBUG) console.log("Script initialized!"); // Check if the script is loading correctly
  
  const minutesElement = document.querySelector("#time-display .minutes");
  const secondsElement = document.querySelector("#time-display .seconds");
  const progressCircle = document.querySelector("#progress-ring circle:last-child");

  const totalTime = 3600; // Duration of one cycle (in seconds)
  count = parseInt(localStorage.getItem("count")) || 0;
  isPaused = localStorage.getItem("isPaused") === "true" ? true : false;
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
    if (DEBUG) console.log("Pause state:", isPaused); // Verify pause state

    // Update Pause/Play button icon
    const icon = pauseButton.querySelector(".material-icons");
    icon.innerText = isPaused ? "play_arrow" : "pause";
  });

  // Reset Button
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    count = 0; // Reset total counter
    
    progressCircle.style.strokeDashoffset = `${circumference}`; // Reset progress bar
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    if (DEBUG) console.log("Counter reset!"); // Confirm reset

    isPaused = false; 
    pauseButton.querySelector(".material-icons").innerText = "pause";

    // Reset progress bar color
    updateStrokeColor(0);
  });

  // Update counter and progress bar
  let lastTimestamp = Date.now(); // Marca inicial

  function updateTimer() {
    if (!isPaused) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTimestamp) / 1000); 

      if (elapsed > 0) {
        count += elapsed; 
        lastTimestamp = now;

        
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

        
        const cycleTime = count % totalTime;
        const progress = cycleTime / totalTime;
        const offset = circumference - progress * circumference;
        progressCircle.style.strokeDashoffset = offset;

        updateStrokeColor(minutes);
      }
    }
    requestAnimationFrame(updateTimer); 
  }

  updateTimer();

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("count", count);
    localStorage.setItem("isPaused", isPaused);
  });


  // Function to update progress bar color based on minutes passed
  function updateStrokeColor(minutes) {
    let baseGray = 0xDD - (minutes * 10);
    if (baseGray < 0x00) baseGray = 0x00; // Prevent the color from becoming fully black
    
    const grayHex = baseGray.toString(16).padStart(2, '0');
    const newColor = `#${grayHex}${grayHex}${grayHex}`;
    progressCircle.style.stroke = newColor;
    if (DEBUG) console.log("Progress bar color updated:", newColor);
  }
});
