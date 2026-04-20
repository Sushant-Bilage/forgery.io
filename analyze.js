const image = document.getElementById("scanImage");
const progress = document.getElementById("progressFill");
const statusText = document.getElementById("statusText");

// get uploaded image
const fileData = localStorage.getItem("uploadedImage");

if (fileData) {
  image.src = fileData;
}

// steps
const steps = [
  "Analyzing pixel patterns...",
  "Checking metadata...",
  "Detecting manipulation...",
  "Running AI model...",
  "Generating PDF report..."
];

let progressValue = 0;
let stepIndex = 0;

// 🔥 SEND TO BACKEND (PDF VERSION)
async function sendToBackend() {
  try {
    // wake backend (important for Render free tier)
    statusText.textContent = "Connecting to AI server...";
    
    const res = await fetch(fileData);
    const blob = await res.blob();

    const response = await fetch(
      "https://forgery-backendnew.onrender.com/detect", // ✅ your new backend
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

    // ✅ RECEIVE PDF
    const pdfBlob = await response.blob();

    // ✅ DOWNLOAD PDF
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forgery-report.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // optional: go back or show message
    statusText.textContent = "Download complete ✅";

  } catch (err) {
    console.error("ERROR:", err);

    alert("Server is waking up... please wait 30 seconds and try again");
  }
}

// progress animation
const interval = setInterval(() => {
  progressValue += 2;
  progress.style.width = progressValue + "%";

  if (progressValue % 20 === 0 && stepIndex < steps.length) {
    statusText.textContent = steps[stepIndex];
    stepIndex++;
  }

  if (progressValue >= 100) {
    clearInterval(interval);
    sendToBackend(); // 🔥 CALL BACKEND
  }
}, 100);
