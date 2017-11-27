var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://colorlovers.now.sh/api/palettes");
oReq.send();

function reqListener() {
    const results = JSON.parse(this.responseText);
    results.forEach(function(item) {

        // set up variable to hold color box markup
        // loop over all the colors
        // for each color, add its markup to the box markup variable

        // variable
        // item.colors loop:
        //   variable += 'individual box markup'

        let colorboxMarkup = '';

        var arrayLength = item.colors.length;
        for (var i = 0; i < arrayLength; i++) {
            console.log(item.colors[i]);
            colorboxMarkup += `<div class='mini--box' style="background:#${item.colors[i]};"></div>`
        }

        // for (let value of item.colors) {
        //   value += 1;
        //   colorboxMarkup += `<div class='mini--box' style="background:#${item.colors[value]};"></div>`
        // }
        var d = new Date(item.dateCreated);
        // var n = d.toLocaleDateString(item.dateCreated);
        console.log('DATE OBJECT', d.getDate());
        var dateString = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;

        // >
        // var date = new Date('2012-04-15T18:06:08-07:00')
        // >
        // date Mon Apr 16 2012 04: 06: 08 GMT + 0300(EEST)

        let markup = `
   <div class='card card-1'>
   <div class='container'>

     ${item.title}
     <span class='end'>

      ${dateString}

     </span>
     <p>
       <span class='big-number'> ${item.numViews} </span> views &nbsp;
       <span class='big-number'> ${item.numVotes} </span> votes &nbsp;
       <span class='big-number'> ${item.numComments} </span> comments &nbsp;
       <span class='big-number'> ${item.numHearts} </span> hearts &nbsp;
     </p>
     </div>
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
