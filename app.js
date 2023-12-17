// selctors and variables
const colorDiv = document.querySelectorAll(".color");

// functions
function generateRandomColor() {
  return chroma.random();
}

function randomColor() {
  colorDiv.forEach((div) => {
    const randomHex = generateRandomColor();
    const hexText = div.children[0];
    // add the color to bg
    div.style.backgroundColor = randomHex;
    hexText.innerText = randomHex;

    //check for hex text contrast
    checkContrast(randomHex, hexText);
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

randomColor();
