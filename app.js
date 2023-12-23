// selctors and variables
const colorDivs = document.querySelectorAll(".color");
const generateButton = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHexs = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainer = document.querySelectorAll(".sliders");
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
let intialColors;
let savedPalettes = [];

// event listeners
generateButton.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

currentHexs.forEach((currentHex) => {
  currentHex.addEventListener("click", () => {
    copyToClipboard(currentHex);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

adjustButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustments.forEach((button, index) => {
  button.addEventListener("click", () => {
    console.log("click");
    closeAdjustmentPanel(index);
  });
});

lockButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    toggleLockButtons(index);
  });
});

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);

// functions
function generateRandomColor() {
  return chroma.random();
}

function randomColors() {
  intialColors = [];
  colorDivs.forEach((div) => {
    const randomColor = generateRandomColor();
    const hexText = div.children[0];

    //check if this panel is locked
    if (div.classList.contains("locked")) {
      intialColors.push(hexText.innerText);
      return;
    } else {
      intialColors.push(chroma(randomColor).hex());
    }
    // add the color to bg
    div.style.background = randomColor;
    hexText.innerText = randomColor;

    //check for hex text contrast
    checkContrast(randomColor, hexText);

    // intial colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hueSlider = sliders[0];
    const brightnessSlider = sliders[1];
    const saturationSlider = sliders[2];
    colorizeSliders(color, hueSlider, brightnessSlider, saturationSlider);
  });
  // reset sliders values
  resetInputs();

  //check slider buttons contrast
  adjustButtons.forEach((button, index) => {
    checkContrast(intialColors[index], button);
  });
  lockButtons.forEach((button, index) => {
    checkContrast(intialColors[index], button);
  });
}

function checkContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hueSlider, brightnessSlider, saturationSlider) {
  colorizehueSlider(hueSlider);
  colorizebrightnessSlider(color, brightnessSlider);
  colorizesaturationSlider(color, saturationSlider);
}

function colorizehueSlider(hueSlider) {
  hueSlider.style.background = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

function colorizebrightnessSlider(color, brightnessSlider) {
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  brightnessSlider.style.background = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
}

function colorizesaturationSlider(color, saturationSlider) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  saturationSlider.style.background = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
}

function hslControls(e) {
  const index = e.target.getAttribute("data-bright") || e.target.getAttribute("data-hue") || e.target.getAttribute("data-sat");
  const sliders = e.target.parentElement.querySelectorAll('input[type="range"]');

  let hue = sliders[0];
  let brightness = sliders[1];
  let saturation = sliders[2];

  const bgColor = intialColors[index];

  let color = chroma(bgColor).set("hsl.h", hue.value).set("hsl.s", saturation.value).set("hsl.l", brightness.value);
  colorizeSliders(color, hue, brightness, saturation);

  colorDivs[index].style.background = color;
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.background);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");

  textHex.innerText = color.hex();
  checkContrast(color, textHex);

  icons.forEach((icon) => {
    checkContrast(color, icon);
  });
}

function resetInputs() {
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = intialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "saturation") {
      const satColor = intialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
    if (slider.name === "brightness") {
      const brightColor = intialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  //popup animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
  sliderContainer[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
  sliderContainer[index].classList.toggle("active");
}

function toggleLockButtons(index) {
  const icon = lockButtons[index].firstChild;
  icon.classList.toggle("fa-lock-open");
  icon.classList.toggle("fa-lock");
  colorDivs[index].classList.toggle("locked");
}

function openPalette() {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

function closePalette() {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savePalette() {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexs.forEach((hex) => {
    colors.push(hex.innerText);
  });

  let paletteNr = savedPalettes.length;
  const paletteObj = { name, colors, nr: paletteNr };
  savedPalettes.push(paletteObj);

  saveToLocal(paletteObj);
  saveInput.value = "";
}

function saveToLocal(paletteObj) {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}
randomColors();
