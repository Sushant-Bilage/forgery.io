// ================= IMAGE LOAD =================
const img = document.getElementById("resultImage");
const stored = localStorage.getItem("uploadedImage");

if (stored) img.src = stored;

// ================= ZOOM =================
let scale = 1;
let posX = 0;
let posY = 0;

const wrapper = document.getElementById("wrapper");

function updateTransform() {
  img.style.transform =
    `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${scale})`;
}

document.getElementById("zoomIn").onclick = () => {
  scale += 0.2;
  updateTransform();
};

document.getElementById("zoomOut").onclick = () => {
  scale = Math.max(0.5, scale - 0.2);
  updateTransform();
};

document.getElementById("reset").onclick = () => {
  scale = 1;
  posX = 0;
  posY = 0;
  updateTransform();
};

// ================= DRAG =================
let isDragging = false;
let startX, startY;

wrapper.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
});

window.addEventListener("mouseup", () => isDragging = false);

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  posX = e.clientX - startX;
  posY = e.clientY - startY;
  updateTransform();
});

// ================= OVERLAY =================
const toggle = document.getElementById("toggleOverlay");
const tags = document.querySelectorAll(".tag");

toggle.addEventListener("change", () => {
  tags.forEach(tag => {
    tag.style.display = toggle.checked ? "block" : "none";
  });
});

// ================= OPACITY =================
const slider = document.getElementById("opacityRange");

slider.addEventListener("input", () => {
  tags.forEach(tag => {
    tag.style.opacity = slider.value / 100;
  });
});

// ================= SCORE =================
const scoreEl = document.getElementById("scoreValue");
let score = 0;

const interval = setInterval(() => {
  score++;
  scoreEl.textContent = score + "%";
  if (score >= 95) clearInterval(interval);
}, 15);

// ================= DOWNLOAD =================
document.querySelector(".download-btn").onclick = () => {
  const blob = new Blob(["Fake AI Report"], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.txt";
  link.click();
};

// ================= RESET =================
document.querySelector(".new-btn").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};
