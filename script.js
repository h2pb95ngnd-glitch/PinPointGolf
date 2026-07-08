
// ===================================
// PinPoint Golf - color version
// ===================================

// ---------- データ ----------
let locations = JSON.parse(localStorage.getItem("locations")) || [];
let markers = [];

let selectedHole = 1;
let selectedShot = "Dr";

// ---------- クラブ定義 ----------
const clubs = ["Dr","5W","5I","6I","7I","8I","9I","PW","AW","SW","PT"];

// ---------- DOM ----------
const holeButtons = document.getElementById("holeButtons");
const shotButtons = document.getElementById("shotButtons");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

const count = document.getElementById("count");
const list = document.getElementById("locationList");

// ---------- 地図 ----------
const map = L.map("map").setView([35.4723, 133.0505], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ---------- 色ルール ----------
function getColor(club) {
  switch (club) {
    case "Dr": return "red";
    case "5W": return "green";
    case "6I": return "blue";
    case "7I": return "orange";
    case "8I": return "purple";
    case "9I": return "black";
    case "PW": return "brown";
    case "AW": return "Yellow";
    case "SW": return "Yellow";
    case "PT": return "white";
  }
}

// ---------- マーカーアイコン ----------
function getIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:14px;
      height:14px;
      border-radius:50%;
      background:${color};
      border:2px solid white;
      box-shadow:0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

// ---------- クラブボタン生成 ----------
clubs.forEach(c => {
  const btn = document.createElement("button");
  btn.className = "shot-btn";
  btn.dataset.shot = c;
  btn.textContent = c;

  if (c === "Dr") btn.classList.add("active");

  btn.addEventListener("click", () => {
    selectedShot = c;

    document.querySelectorAll(".shot-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
  });

  shotButtons.appendChild(btn);
});

// ---------- ホール生成 ----------
for (let i = 1; i <= 18; i++) {
  const btn = document.createElement("button");
  btn.className = "hole-btn";
  btn.textContent = i;

  if (i === 1) btn.classList.add("active");

  btn.addEventListener("click", () => {
    selectedHole = i;

    document.querySelectorAll(".hole-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
  });

  holeButtons.appendChild(btn);
}

// ---------- 描画 ----------
function draw() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  list.innerHTML = "";

  count.textContent = `保存数：${locations.length}`;

  locations.forEach(loc => {
    const color = getColor(loc.shot);

    const marker = L.marker([loc.lat, loc.lng], {
      icon: getIcon(color)
    }).addTo(map);

    marker.bindPopup(`
      Hole ${loc.hole}<br>
      ${loc.shot}<br>
      ${loc.time}
    `);

    markers.push(marker);

    const li = document.createElement("li");
    li.innerHTML = `
      Hole ${loc.hole} / ${loc.shot} / ${loc.time}
    `;

    list.appendChild(li);
  });
}

// ---------- 保存 ----------
saveBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const data = {
      hole: selectedHole,
      shot: selectedShot,
      time: new Date().toLocaleString(),
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };

    locations.push(data);

    localStorage.setItem("locations", JSON.stringify(locations));

    draw();

    map.setView([data.lat, data.lng], 18);
  });
});

// ---------- リセット ----------
resetBtn.addEventListener("click", () => {
   locations = [];
  localStorage.removeItem("locations");
  draw();});

// ---------- 初期 ----------
draw();
