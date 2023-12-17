// selctors and variables
const colorDiv = document.querySelectorAll(".color");

// functions
function generateRandomColor() {
  return chroma.random();
}

function randomColors() {
  colorDiv.forEach((div) => {
    const randomHex = generateRandomColor();
    const hexText = div.children[0];
    // add the color to bg
    div.style.background = randomHex;
    hexText.innerText = randomHex;

    //check for hex text contrast
    checkContrast(randomHex, hexText);

    // intial colorize sliders
    const color = chroma(randomHex);
    const sliders = div.querySelectorAll(".sliders input");
    const hueSlider = sliders[0];
    const brightnessSlider = sliders[1];
    const saturationSlider = sliders[2];
    colorizeSliders(color, hueSlider, brightnessSlider, saturationSlider);
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

randomColors();
