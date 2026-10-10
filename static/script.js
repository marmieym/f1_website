async function loadStandings() {
  const status = document.querySelector("#standings-status");
  const tbody = document.querySelector("#standings-body");

  try {
    const response = await fetch("/api/standings");
    const data = await response.json();

    let html = "";
    for (const d of data.drivers) {
      html += `
        <tr>
          <td>${d.position}</td>
          <td>${d.fullName}</td>
          <td>${d.team}</td>
          <td>${d.points}</td>
          <td>${d.wins}</td>
          <td>${d.nationality}</td>
        </tr>`;
    }
    tbody.innerHTML = html;
    fillDropdowns(data.drivers);
    status.textContent = "Season " + data.season;
  } catch (error) {
    status.textContent = "Could not load standings";
  }
}

loadStandings();

async function loadSchedule() {
  const box = document.querySelector("#schedule-list");
  const response = await fetch("/api/schedule");
  const data = await response.json();

  let html = "";
  for (const race of data.races) {
    html += `
      <div class="race-card">
        <div class="race-round">Round ${race.round}</div>
        <div class="race-name">${race.name}</div>
        <div class="race-meta">${race.circuit} · ${race.locality}, ${race.country}</div>
        <div class="race-date">${race.date}</div>
      </div>`;
  }
  box.innerHTML = html;
}

loadSchedule();

function fillDropdowns(drivers) {
  let options = "";
  for (const d of drivers) {
    options += `<option value="${d.driverId}">${d.fullName}</option>`;
  }
  document.querySelector("#driver1").innerHTML = options;
  document.querySelector("#driver2").innerHTML = options;
  document.querySelector("#driver2").selectedIndex = 1;
}

document.querySelector("#compare-btn").addEventListener("click", async () => {
  const id1 = document.querySelector("#driver1").value;
  const id2 = document.querySelector("#driver2").value;
  const box = document.querySelector("#compare-result");

  const response = await fetch(`/api/compare?d1=${id1}&d2=${id2}`);
  const data = await response.json();

  if (!response.ok) {
    box.textContent = data.error;
    return;
  }

  const a = data.driver1;
  const b = data.driver2;
  box.innerHTML = `
    <table>
      <tr><th>${a.fullName}</th><th></th><th>${b.fullName}</th></tr>
      <tr><td>${a.points}</td><td>Points</td><td>${b.points}</td></tr>
      <tr><td>${a.wins}</td><td>Wins</td><td>${b.wins}</td></tr>
      <tr><td>${a.team}</td><td>Team</td><td>${b.team}</td></tr>
    </table>`;
});