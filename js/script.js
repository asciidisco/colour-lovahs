var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://colorlovers.now.sh/api/palettes");
oReq.send();

function reqListener () {
 const results = JSON.parse(this.responseText);
 results.forEach(function(item) {

   // set up variable to hold color box markup
   // loop over all the colors
   // for each color, add its markup to the box markup variable

   // variable
   // item.colors loop:
   //   variable += 'individual box markup'

let colorboxMarkup;

var arrayLength = item.colors.length;
for (var i = 0; i < arrayLength; i++) {
    colorboxMarkup += `<div class='mini--box' style="background:#${item.colors[i]};"></div>`
  }

  // let colorLooper =
  // for (let value of item.colors) {
  //   value += 1;
  //   console.log(value);
  // }


   let markup = `
   <div class='card card-1'>
     ${item.title}
     <span class='right'>
      ${item.dateCreated}
     </span>
     <p>
       <span class='big-number'> ${item.numViews} </span> views &nbsp;
       <span class='big-number'> ${item.numVotes} </span> votes &nbsp;
       <span class='big-number'> ${item.numComments} </span> comments &nbsp;
       <span class='big-number'> ${item.numHearts} </span> hearts &nbsp;
     </p>
     <div class='box'>
      ${colorboxMarkup}
       </div>
     </div>`;
   document.body.innerHTML += markup;
 })
}

// const arr = ['a', 'b', 'c'];
//
// arr.forEach(function(element) {
//     console.log(element);
// });


// I want to loop through the 'colors' array
// I want to place each hex value in the array into a predefined box
// I want the 'background' property to be populated by the hex codes

// const palette = {
//   name: "Awesome Palette",
//   date: Date.now()
// };

// const palettes = [
//   {
//     name: "Awesome Palette",
//     date: Date.now()
//   },
//   {
//     name: "Awesome Palette",
//     date: Date.now()
//   },
//   {
//     name: "Awesome Palette",
//     date: Date.now()
//   },
//   {
//     name: "Ok Palette",
//     date: Date.now()
//   }
// ]

  // for (var i = 0; i < item.colors; i++) {
  //   let markup = `
  //     <div class='card card-1'>
  //       ${item.colors[i]}
  //       </span>
  //     </div>`;
  //
  //   document.body.innerHTML += markup;
  // }
