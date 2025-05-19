// script.js
// 1) Mobile menu toggle
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(div => {
    div.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// 2) Logout (clears the same key you used to store on login)
function logout() {
  alert("You have been logged out.");
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// 3) Google Sheets Web App URL
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxrPQ6SDGFouUwgRPGCqSgTiFX7r9L_5_HCIbCwaz5e2I_HK-fgLXQicom3tmAwvN8/exec";

const INST_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxOq1QKJyQmQTy7xehK2oyytY3AmVBWqtbf41roz3yNrVuaNzQR_BV89Pp_jXR_amfrtg/exec";

// 4) In-memory array of bookings (for display & export)
const conferenceBookings = [];

const instrumentationBookings = [];

// limit date picker today → today+7d
document.addEventListener('DOMContentLoaded', () => {
  const dp = document.getElementById('confDate');
  const today = new Date();
  const toIso = d => d.toISOString().slice(0,10);
  dp.min = toIso(today);
  today.setDate(today.getDate()+7);
  dp.max = toIso(today);
});

/**
 * Called when "Conference Book Slot" is clicked.
 * Sends { name, number, slot } to your Apps Script,
 * then updates the table in the XLSX.
 */
async function bookConference() {
  const name     = document.getElementById('confName').value.trim();
  const number   = document.getElementById('confNumber').value.trim();
  const date     = document.getElementById('confDate').value;
  const slot     = document.getElementById('confSlot').value;
  const purpose  = document.getElementById('confPurpose').value.trim();
  const msg      = document.getElementById('confMessage');

  // Validation
  if (!name || !number || !date || !slot || !purpose) {
    msg.textContent = "Please fill in all fields.";
    msg.style.color = "red";
    return;
  }
  if (conferenceBookings.some(b => b.date === date && b.slot === slot)) {
    msg.textContent = "That date+slot is already booked!";
    msg.style.color = "red";
    return;
  }

  try {
    // POST all five fields
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method:  "POST",
      mode:    "no-cors",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, number, date, slot, purpose })
    });

    // Update in-memory and UI
    conferenceBookings.push({ name, number, date, slot, purpose });
    updateConferenceTable();

    msg.textContent = "Your Booking is Confirmed!";
    msg.style.color   = "green";
    ['confName','confNumber','confDate','confSlot','confPurpose']
      .forEach(id => document.getElementById(id).value = "");

  } catch (err) {
    console.error(err);
    msg.textContent = "Error—please try again.";
    msg.style.color = "red";
  }
}

/**
 * Re‐renders the table of current bookings.
 */
function updateConferenceTable() {
  const tbody = document.getElementById('confTableBody');
  tbody.innerHTML = "";
  conferenceBookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="border:1px solid #ccc; padding:8px;">${b.name}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.number}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.date}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.slot}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.purpose}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Called when "Instrumentation Book Slot" is clicked.
 * Sends { name, number, slot } to your Apps Script,
 * then updates the table in the XLSX.
 */
async function bookInstrumentation() {
  const instrumentname     = document.getElementById('instInstrumentName').value.trim();
  const name     = document.getElementById('instName').value.trim();
  const number   = document.getElementById('instNumber').value.trim();
  const date     = document.getElementById('instDate').value;
  const slot     = document.getElementById('instSlot').value;
  const purpose  = document.getElementById('instPurpose').value.trim();
  const msgEl    = document.getElementById('instMessage');

  if (!instrumentname || !name || !number || !date || !slot || !purpose) {
    msgEl.textContent = "Please fill in all fields.";
    msgEl.style.color = "red";
    return;
  }

  if (instrumentationBookings.some(b => b.date === date && b.slot === slot)) {
    msgEl.textContent = "This slot on the selected date is already booked!";
    msgEl.style.color = "red";
    return;
  }

  const payload = { instrumentname, name, number, date, slot, purpose };

  try {
    await fetch(INST_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    instrumentationBookings.push(payload);
    updateInstrumentationTable();

    msgEl.textContent = "Instrumentation slot booked!";
    msgEl.style.color = "green";

    ['instInstrumentName','instName','instNumber','instDate','instSlot','instPurpose']
      .forEach(id => document.getElementById(id).value = "");

  } catch (err) {
    console.error("Instrumentation booking error:", err);
    msgEl.textContent = "Failed to save booking.";
    msgEl.style.color = "red";
  }
}

function updateInstrumentationTable() {
  const tbody = document.getElementById('instTableBody');
  tbody.innerHTML = "";
  instrumentationBookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="border:1px solid #ccc; padding:8px;">${b.instrumentname}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.name}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.number}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.date}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.slot}</td>
      <td style="border:1px solid #ccc; padding:8px;">${b.purpose}</td>
    `;
    tbody.appendChild(tr);
  });
}

// For Events Hackthon/Intership
function openEventTab(evt, eventName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab and add an "active" class to the button that opened the tab
  document.getElementById(eventName).style.display = "block";
  evt.currentTarget.className += " active";
}


// Ensure user is logged in, else redirect
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) window.location.href = 'login.html';
});
