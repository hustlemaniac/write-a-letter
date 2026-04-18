
//at startup
//fetch all the fonts from google fonts
const fontSelector = document.getElementById("fontSelector");
let allFonts = [];

fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=APIKEY&sort=style')
//once you get the result from url -> get fonts sorted by style
  .then(res => res.json())
  .then(data => {
//  for the element with id font selector
    const fontSelector = document.getElementById('fontSelector');
    data.items.forEach(font => {
//    for each font
//make an option for drop down
      const option = document.createElement('option');
//       then value is font family
      option.value = `'${font.family}', ${font.category === 'serif' ? 'serif' : 'sans-serif'}`;
//      then font family is again the text that appears in drop down
      option.textContent = font.family;
//      append the option to the drop down
      fontSelector.appendChild(option);
    });
  });


// Apply bold, italic, subscript, superscript, underline, strikethrough formatting
function formatText(command) {
//whatever value is passed is the command to execute the formatting
  document.execCommand(command, false, null);
}

// Change font style dynamically on change
function changeFont(font) {
// get the editor content
  const editor = document.getElementById("editor");
//  font of the editor
  editor.style.fontFamily = font;

// get the dynamic font
  const linkId = "dynamic-font";
//font selector id
  let link = document.getElementById(linkId);
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  const fontName = font.split(",")[0].replace(/'/g, "");
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
}

// Download as PDF
function downloadPDF() {
//  get the content in the editor section
  const element = document.getElementById("editor");
//  the content dimensions
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflowY;

  // set the elements dimensions to the ones we need for our pdf
  element.style.height = "auto";
  element.style.overflowY = "visible";

// set the options for how the pdf needs to be prepared
  const options = {
    margin: 10,
//    pdf file name
    filename: "letter.pdf",
//    image settings
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
//    pdf settings
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//    sentences break bw pages
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };
// now make the pdf
  html2pdf()
    .set(options)
    .from(element)
//    save to the browser
    .save()
//    then restore original dimensions of the editor
    .then(() => {
      // Restore styles after PDF generation
      element.style.height = originalHeight;
      element.style.overflowY = originalOverflow;
    });
}


// mail the content
function mailLetter() {
//  get the editor content
  const letterContent = document.getElementById("editor").innerText;
//  subject
  const subject = encodeURIComponent("My Letter");
//  editor content will be the body
  const body = encodeURIComponent(letterContent);
//  to address -> pop default mail client of the system
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
}

// get text color -> rgb values
document.getElementById('textColorBtn').addEventListener('click', () => {
  document.getElementById('textColorPicker').click();
});

//change text color to chosen color
document.getElementById('textColorPicker').addEventListener('input', function() {
  document.execCommand('foreColor', false, this.value);
});

//get the text highlight
document.getElementById('highlightBtn').addEventListener('click', () => {
  document.getElementById('highlightPicker').click();
});

//change text highlight color to chosen color
document.getElementById('highlightPicker').addEventListener('input', function() {
  document.execCommand('hiliteColor', false, this.value);
});

//change font size
function changeFontSize(action) {
//  get editor content
  const editor = document.getElementById('editor');
//current editor font size else default
  let currentSize = window.getComputedStyle(editor).fontSize;
//  remove px from the returned size
  currentSize = parseInt(currentSize.replace('px',''));
//if increase
  if (action === 'increase') {
//    increase by 2
    currentSize += 2;
  }
//  decrease
  else if (action === 'decrease') {
//    decrease by 2 but keep minimum 8px
    currentSize = Math.max(currentSize - 2, 8);
  }
//now set the font size of editor content to size calculated
  editor.style.fontSize = currentSize + 'px';
}

// get the color picked in the color picker for background
document.getElementById('bgColorBtn').addEventListener('click', () => {
  document.getElementById('bgColorPicker').click();
});

// apply the same color to background
document.getElementById('bgColorPicker').addEventListener('input', function() {
  const editor = document.getElementById('editor');
  editor.style.backgroundColor = this.value;
});



// apply page style
document.getElementById('pageLinesSelector').addEventListener('change', function() {
//  get the editor content
  const editor = document.getElementById('editor');
  const value = this.value;


//  remove the existing style when an item is selected
  editor.classList.remove('ruled', 'unruled');

  switch(value) {
//    unruled style
    case 'unruled':
      editor.style.backgroundColor = 'white';
      break;
//    ruled style
    case 'ruled':
      editor.classList.add('ruled');
      break;
  }
});
