// --- SAMPLE JIT ENGINE (simple for playground only) ---

function garurCompile(utilityString) {
  const utilities = utilityString.trim().split(/\s+/);
  let css = "";

  utilities.forEach(u => {
    if (u.startsWith("p-")) {
      const val = u.split("-")[1];
      css += `padding:${val * 4}px;`;
    }
    if (u.startsWith("m-")) {
      const val = u.split("-")[1];
      css += `margin:${val * 4}px;`;
    }
    if (u === "glass") {
      css += `background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:12px;`;
    }
    if (u.startsWith("text-")) {
      const val = u.split("-")[1];
      css += `color:${val};`;
    }
    if (u.startsWith("bg-")) {
      const val = u.split("-")[1];
      css += `background:${val};`;
    }
  });

  return css;
}

// --- UI LOGIC ---
document.getElementById("compileBtn").addEventListener("click", () => {
  const text = document.getElementById("input").value;
  const compiled = garurCompile(text);

  document.getElementById("cssOutput").textContent = compiled;
  document.getElementById("preview-box").style = compiled;
});
