function OfficeTimeCalculate(startTime, endTime, breakTime, duration) {
  // Function to generate time slots

    const timeSlots = [];
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const breakInMinutes = parseInt(breakTime, 10);

    while (start <= end) {
      const currentSlot = formatTime(start);
      console.log(currentSlot);
      timeSlots.push(currentSlot);

      // Add the break time
      start.setMinutes(start.getMinutes() + breakInMinutes + duration);
      // Check if we need to switch from AM to PM or vice versa
      // Handle transitions from PM to AM
      if (start.getHours() === 0 && start.getMinutes() === 0) {
        start.setHours(12);
        timeSlots.push("12:00 AM");
      }
    }
    console.log(timeSlots);
    return timeSlots;

  
}

// Helper function to parse time string into a Date object
const parseTime = (time) => {
  const [timeStr, ampm] = time.split(" ");
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(ampm === "PM" ? parseInt(hours, 10) + 12 : parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date;
};

// Helper function to format a Date object as a 12-hour time string with AM/PM
const formatTime = (time) => {
  const hours = time.getHours() % 12 || 12; // Convert 0 to 12
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes} ${ampm}`;
};

export default OfficeTimeCalculate;
