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

  // Check if this is a historical audit
  const isHistorical = endTime < currentDate;
  const STANDARD_MONTH_DAYS = 30;

  if (isHistorical) {
    // For historical audits, only show the monthly average
    const adjustedDays = STANDARD_MONTH_DAYS - loa;
    const average = tickets / adjustedDays;
    const [zoneClass, zoneName] = getPerformanceZone(average);

    let output = `<h3>Results for ${name}</h3>`;
    output += `<p class="${zoneClass}">Monthly Average: ${average.toFixed(
      2
    )} tickets/day (${zoneName} Zone)</p>`;

    document.getElementById("result").innerHTML = output;
  } else {
    // For current period, calculate days elapsed since start
    const daysUntilNow = Math.max(
      1,
      Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24))
    );
    const workingDays = Math.max(1, daysUntilNow - loa);
    const remainingDays = Math.max(1, STANDARD_MONTH_DAYS - daysUntilNow);

    // Calculate current average based on working days so far
    const average = tickets / workingDays;
    const [zoneClass, zoneName] = getPerformanceZone(average);

    // Calculate total tickets needed for whole month
    const target3 = 3 * (STANDARD_MONTH_DAYS - loa);
    const target4_2 = 4.2 * (STANDARD_MONTH_DAYS - loa);
    const target5 = 5 * (STANDARD_MONTH_DAYS - loa);

    // Calculate remaining tickets needed
    const remaining3 = Math.ceil(target3 - tickets);
    const remaining4_2 = Math.ceil(target4_2 - tickets);
    const remaining5 = Math.ceil(target5 - tickets);

    // Calculate tickets per day needed
    const perDay3 = Math.ceil(remaining3 / remainingDays);
    const perDay4_2 = Math.ceil(remaining4_2 / remainingDays);
    const perDay5 = Math.ceil(remaining5 / remainingDays);

    let output = `<h3>Results for ${name}</h3>`;
    output += `<p class="${zoneClass}">Current Average: ${average.toFixed(
      2
    )} tickets/day (${zoneName} Zone)</p>`;
    output += `<p>3.0 average: ${
      tickets >= target3
        ? `✅ Secured!`
        : `❌ Need ${remaining3} tickets (${perDay3} per day) to reach`
    }</p>`;
    output += `<p>4.2 average: ${
      tickets >= target4_2
        ? `✅ Secured!`
        : `❌ Need ${remaining4_2} tickets (${perDay4_2} per day) to reach`
    }</p>`;
    output += `<p>5.0 average: ${
      tickets >= target5
        ? `✅ Secured!`
        : `❌ Need ${remaining5} tickets (${perDay5} per day) to reach`
    }</p>`;

    document.getElementById("result").innerHTML = output;
  }
});
