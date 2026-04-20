// ================= IMAGE =================
const img = document.getElementById("resultImage");
const stored = localStorage.getItem("uploadedImage");

if (stored) img.src = stored;

// ================= SCORE =================
const scoreEl = document.getElementById("scoreValue");
const badge = document.querySelector(".risk-badge");
const desc = document.querySelector(".desc");
const circle = document.querySelector(".circle");

// 👉 Replace with real backend later
let score = Math.floor(Math.random() * 100);

// animate score
let current = 0;
const interval = setInterval(() => {
  current++;
  scoreEl.textContent = current + "%";

  if (current >= score) clearInterval(interval);
}, 15);

// 🎨 COLOR LOGIC
if (score < 25) {
  // GREEN
  circle.style.border = "10px solid #16a34a";
  circle.style.color = "#16a34a";

  badge.textContent = "Low Risk";
  badge.style.background = "#dcfce7";
  badge.style.color = "#166534";

  desc.textContent =
    "Document appears genuine. No major tampering detected.";
}
else if (score < 50) {
  // ORANGE
  circle.style.border = "10px solid #f59e0b";
  circle.style.color = "#f59e0b";

  badge.textContent = "Moderate Risk";
  badge.style.background = "#fef3c7";
  badge.style.color = "#92400e";

  desc.textContent =
    "Some inconsistencies detected. Please verify manually.";
}
else {
  // RED
  circle.style.border = "10px solid #dc2626";
  circle.style.color = "#dc2626";

  badge.textContent = "Critical Risk";
  badge.style.background = "#fee2e2";
  badge.style.color = "#991b1b";

  desc.textContent =
    "Strong evidence of document manipulation detected.";
}

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

// ================= DOWNLOAD PDF =================
document.querySelector(".download-btn").onclick = async () => {
  const fileData = localStorage.getItem("uploadedImage");

  if (!fileData) {
    alert("No image found");
    return;
  }

  try {
    const res = await fetch(fileData);
    const blob = await res.blob();

    const response = await fetch(
      "https://forgery-backendnew.onrender.com/detect",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream"
        },
        body: blob
      }
    );

    if (!response.ok) {
      throw new Error("Server error");
    }

    const pdfBlob = await response.blob();

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forgery-report.pdf";
    a.click();

  } catch (err) {
    console.error(err);
    alert("Error downloading PDF");
  }
};

// ================= RESET =================
document.querySelector(".new-btn").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};
