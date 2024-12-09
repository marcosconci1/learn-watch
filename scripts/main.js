// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const counterElement = document.getElementById("counter"); 
  let count = 0; // Initialize the counter value

  // Select the reset button and add a click event listener
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
      count = 0; // Reset the counter value
      counterElement.innerText = formatTime(count); // Update the display
  });

  // Select the pause button and initialize the pause state
  const pauseButton = document.getElementById("pauseButton");
  let isPaused = false; 

  pauseButton.addEventListener("click", () => {
      isPaused = !isPaused; 
      pauseButton.innerText = isPaused ? "Resume" : "Pause"; 
  });

  // Create the interval to update the counter every second
  setInterval(() => {
      if (!isPaused) { 
          count++;
          counterElement.innerText = formatTime(count); // Update the display
      }
  }, 1000);

  // Format time into MM:SS
  function formatTime(count) {
      const min = Math.floor(count / 60); // Calculate minutes
      const seg = count % 60;            // Calculate seconds
      const formattedMinutes = String(min).padStart(2, "0"); // Format minutes
      const formattedSeconds = String(seg).padStart(2, "0"); // Format seconds
      return `${formattedMinutes}:${formattedSeconds}`;      // Return formatted time
  }

  // Set initial display value
  counterElement.innerText = formatTime(count);
});
