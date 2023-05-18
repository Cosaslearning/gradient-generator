//-----  Gradient Color Variables  -----//
const gradientBox = document.querySelector(".gradient-box");
const selectMenu = document.querySelector(".select-box select");
const colorInputs = document.querySelectorAll(".colors input");
const textarea = document.querySelector("textarea");
const refreshBtn = document.querySelector(".refresh");
const copyBtn = document.querySelector(".copy");
const download = document.querySelector(".download");
const ranDownload = document.querySelector(".ranDownload");
const rowItemBig = document.querySelector(".row-item-big");

//-----  Generating a random color in hexadecimal format. Example: #5665E9  -----//
const getRandomColor = () => {
  const randomHex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${randomHex.padStart(6, "0")}`;
}

//-----  Generating Gradient Color  -----//
const generateGradient = (isRandom) => {
  if(isRandom) { // If isRandom is true, update the colors inputs value with random colors
      colorInputs[0].value = getRandomColor();
      colorInputs[1].value = getRandomColor();
    }
    // Creating a gradient string using the select menu value with color input values
    const gradient = `linear-gradient(${selectMenu.value}, ${colorInputs[0].value}, ${colorInputs[1].value})`;
    gradientBox.style.background = gradient;
    textarea.value = `background: ${gradient};`;
}

//-----  Header's Copy Button  -----//
const copyCode = () => {
    // Copying textarea value and updating the copy button text
    navigator.clipboard.writeText(textarea.value);
    copyBtn.innerHTML = "Copied &#10004; ";
    setTimeout(() => copyBtn.innerText = "Copy Code", 1000);
}
copyBtn.addEventListener("click", copyCode);

//-----  When click on textarea it'll copy textarea value  -----//
rowItemBig.addEventListener("click", copyCode);

//-----  Getting Values For Download Gradient Image  -----//
download.addEventListener("click", () => downloadGradient(selectMenu.value, colorInputs[0].value, colorInputs[1].value));

//-----  Random Gradient Colors Vars  -----//
const container = document.querySelector(".container");
const refreshBtn2 = document.querySelector(".refresh-btn");
const maxPaletteBoxes = 30;

//-----  Random Gradient Colors  -----//
const generatePalette = () => {
    container.innerHTML = ""; // clearing the container
    for (let i = 0; i < maxPaletteBoxes; i++) {
        let colorRanOne = getRandomColor();
        let colorRanTwo = getRandomColor();
        // creating a new 'li' element and inserting it to the container
        const color = document.createElement("li");
        color.classList.add("color");
        color.innerHTML = `<div class="rect-box" style="background:linear-gradient(${selectMenu.value}, ${colorRanOne}, ${colorRanTwo});">
        <span class="ranDownload" title="Download .jpg"><i class="fa-solid fa-download"></i></span></div>
        <span class="hex-value">Copy Code</span>`;
        // adding click events to current li element to copy the color and download image 
        const copyText = color.querySelector(".hex-value");
        const ranDownload = color.querySelector(".ranDownload");
        copyText.addEventListener("click", () => copyColor(color, selectMenu.value, colorRanOne, colorRanTwo));
        ranDownload.addEventListener("click", () => downloadGradient(selectMenu.value, colorRanOne, colorRanTwo));        
        container.appendChild(color);
    }
}
generatePalette();

//-----  Random Gradient Color Copy Button -----//
const copyColor = (elem, selectDirection, firstColor, secondColor) => {
    const colorElement = elem.querySelector(".hex-value");
    // Copying the hex value, updating the text to copied, 
    // and changing text back to original hex value after 1 second
    const codeText = `background:linear-gradient(${selectDirection}, ${firstColor}, ${secondColor});`
    navigator.clipboard.writeText(codeText).then(() => {
        colorElement.innerHTML = "Copied &#10004; ";
        setTimeout(() => colorElement.innerText = "Copy Code", 1000);
    }).catch(() => alert("Failed to copy the color code!")); // showing alert if color can't be copied
}

//----- Calling generateGradient & generatePalette function on each color input clicks  -----//
colorInputs.forEach(input => {
    input.addEventListener("input", () => {
      generateGradient(false);
      generatePalette();
    })
});

//----- Calling generateGradient function on change selectMenu values & also changing random gradient colors direction according to selectMenu -----//
selectMenu.addEventListener("change", () => {
    generateGradient(false);    
    // Get all the div elements within li elements
    const clrdirections = document.querySelectorAll("li > div");
    // Loop through each element and update their background gradient direction
    clrdirections.forEach((clrdirection) => {
      const currentBgImageStyle = window.getComputedStyle(clrdirection).getPropertyValue("background-image");
      const currentGradientDirection = currentBgImageStyle.match(/to\s+(top|bottom|left|right)(?:\s+(top|bottom|left|right))?/i);
      
      if (currentGradientDirection !== null) {
        clrdirection.style.backgroundImage = currentBgImageStyle.replace(currentGradientDirection[0], selectMenu.value);
      } else {
        var backgroundColor = clrdirection.style.backgroundImage;
        // Extract the two colors
        var colors = backgroundColor.match(/rgba?\([^)]+\)|[a-f\d]{3,6}/ig);
        // Store the first and second colors in separate variables
        var firstColor = colors[0];
        var secondColor = colors[1];
        clrdirection.style.backgroundImage = `linear-gradient(${selectMenu.value}, ${firstColor}, ${secondColor}`;
      }
    });
  });  

//----- Refresh Button  -----//  
refreshBtn.addEventListener("click", () => {
    generateGradient(true);
    generatePalette();
});

//-----  Download Image ( html to canvas) -----//
function downloadGradient(directionDown, firstclrDown, secondclrDown) {
  const canvasDiv = document.getElementById("myCanvas");
  const ranBackDown = `linear-gradient(${directionDown}, ${firstclrDown}, ${secondclrDown})`;
  canvasDiv.style.backgroundImage = ranBackDown;
  // Capture the HTML element as an image using html2canvas
  html2canvas(canvasDiv).then(function(canvas) {
  // Convert the canvas to a data URL and download as a JPG file
   var link = document.createElement("a");
   link.download = "Gradient-Cosas-Learning.jpg";
   link.href = canvas.toDataURL("image/jpeg");
   link.click();
  });
}

