// Theme switching
const themeToggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

// Set initial theme based on system preference
if (prefersDark.matches) {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
});

function getPerformanceZone(average) {
  if (average <= 3.4) return ["red-zone", "RED"];
  if (average <= 5.0) return ["yellow-zone", "YELLOW"];
  if (average <= 8.0) return ["green-zone", "GREEN"];
  return ["purple-zone", "PURPLE"];
}

// Calculator functionality
document.getElementById("calculateBtn").addEventListener("click", function () {
  const name = document.getElementById("name").value;
  const tickets = parseInt(document.getElementById("ticketCount").value);
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const loa = parseInt(document.getElementById("loa").value) || 0;
  const currentDate = new Date();

  // Set both start and end times to 21:00 (9 PM)
  startDate.setHours(21, 0, 0, 0);
  const endTime = new Date(endDate);
  endTime.setHours(21, 0, 0, 0);

  const STANDARD_MONTH_DAYS = 30;
  const adjustedMonthDays = STANDARD_MONTH_DAYS - loa; // Total working days in the month

  // Calculate current average based on adjusted days
  const average = tickets / adjustedMonthDays;
  const [zoneClass, zoneName] = getPerformanceZone(average);

  // Calculate targets based on adjusted month days
  const target3 = 3 * adjustedMonthDays;
  const target4_2 = 4.2 * adjustedMonthDays;
  const target5 = 5 * adjustedMonthDays;

  // Calculate if targets are actually secured based on total tickets needed
  const secured3 = tickets >= target3;
  const secured4_2 = tickets >= target4_2;
  const secured5 = tickets >= target5;

  // Calculate remaining tickets needed
  const remaining3 = Math.max(0, target3 - tickets);
  const remaining4_2 = Math.max(0, target4_2 - tickets);
  const remaining5 = Math.max(0, target5 - tickets);

  let output = `<h3>Results for ${name}</h3>`;
  output += `<p class="${zoneClass}">Current Average: ${average.toFixed(
    2
  )} tickets/day (${zoneName} Zone)</p>`;
  output += `<p>3.0 average: ${
    secured3
      ? `✅ Secured!`
      : `❌ Need ${remaining3.toFixed(2)} tickets to reach`
  }</p>`;
  output += `<p>4.2 average: ${
    secured4_2
      ? `✅ Secured!`
      : `❌ Need ${remaining4_2.toFixed(2)} tickets to reach`
  }</p>`;
  output += `<p>5.0 average: ${
    secured5
      ? `✅ Secured!`
      : `❌ Need ${remaining5.toFixed(2)} tickets to reach`
  }</p>`;

  document.getElementById("result").innerHTML = output;
});
