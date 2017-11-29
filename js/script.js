// NOTE
// If you´re already using `let` and `const` you´re assuming a modern browser
// see: https://caniuse.com/#feat=let & https://caniuse.com/#feat=const
// So you´d be able to use `fetch` instead of `XMLHttpRequest`
// see: https://jakearchibald.com/2015/thats-so-fetch/
// You´d only sacrifice IE 11 compatibility if you do
// see: https://caniuse.com/#search=fetch
// Which, if needed, could be polyfilled quite easily
// see: https://github.com/github/fetch
// What´s a polyfill?
// see: https://remysharp.com/2010/10/08/what-is-a-polyfill

// NOTE
// You haven't done anything in regards to error handling on the HTTP level in the old impl. (f.e. the service is down etc.)
// With fetch (which returns a promise) this is quite easy, as you´d only need to give the `catch` function a callback as well as the `then` function
// You can see it in action in the `__init` function
// I´ve also tunred the call into a function which can be invoked at the end of the script,
// so that refactoring of the code (f.e. delaying the response and/or showing a loading animation of some sort)
// can be implemented easier, as the code isn't called straight away when the javascript file has been loaded/parsed

// NOTE
// Promises are... ... ...hard
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// better explanation of the concepts: https://developers.google.com/web/fundamentals/primers/promises
// also, this video tutorial about Promises is atrue gem: https://www.youtube.com/watch?v=g90irqWEqd8
// It tooke me a lot of time to get around the concepts behind promises, so don't give up if you´re not getting it right away
// it is a complex topic & definitely needs some time to wrap your head around

// NOTE
// You might have also noticed that I added function names like `__parse_colorlovers_json`
// to so called "anonymous" functions
// Those are not needed for the function to work like expected, but it really helps
// to track errors if they occur
// Without a name, the stacktrace in your console would only state `anonymous function`, but as we´ve
// given it a name, the actual name would appear in the error stacktrace & we can quickly find the code
// the error is located in
// see: https://github.com/i0natan/nodebestpractices#-35-name-your-functions

// fetches the palettes data from the colorlovers API
// returns a promise
function fetch_palettes() {
    return fetch('https://colorlovers.now.sh/api/palettes').then(function __parse_colorlovers_json(response) {
        return response.json();
    }).catch(handle_api_error);
}

// handles HTTP level errors
function handle_api_error(err) {
    console.error('API Error', err);
    alert('The colorlovers API seems to have some problems. Please try again later');
}

// NOTE
// I´ve changed the function naming from CamelCase
// see: https://en.wikipedia.org/wiki/Camel_case
// to Snake Case
// see: Snake_case
// Usually, camelCase is used to name classes & methods (using OOP-ish style)
// while snake_case is used to name functions & variables that are not class properties

// formates date strings
// returns `WEEKDAY, DAY MONTH YEAR`
// example `Tuesday, 2 December 2008`
function format_date(raw_date) {
    // NOTE
    // Instead of manually puzzling together the date string, you can use the date internationalisation
    // functionality of javascript
    // see: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    // It also gives you more accessible formating options, I´ve changed the date formatting to show some of those
    const parsed_date = new Date(raw_date);
    const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return parsed_date.toLocaleDateString('en-gb', date_options);
}

// NOTE
// I´ve changed the name from `reqListener` to `create_palettes_markup` to make the intention of the function a bit clearer
// I´ve also changed the argument name from `result` to `palettes` which resembles the contents of the variable

// turns the colorlovers response JSON into HTML markup
function create_palettes_markup(palettes) {
    // NOTE
    // I´ve exchanged your `forEach` with a `map` function
    // instead of populating en external variable & appending to it over and over,
    // it produces one array with the contents that will be returned
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

    // NOTE
    // I´ve also created a new function that will be called by map,
    // it keeps this function small & easy to read

    // map through all palettes to generate the html markup
    // palettes_html is an array now  
    return palettes.map(create_palette_markup);
}

// inserts the palettes markup into the DOM as childNodes of the <body> element
function insert_palettes(palettes_markup) {
    // NOTE
    // This might be a bit confusing now, but I´ll try my best to explain why I´ve exchanged
    // the `innerHTML` code with this construct
    // Before the change, you´ve used `innerHTML` within a loop to push your markup into the DOM
    // The DOM got altered every time the loop created a new colourbox, as DOM operations are the most
    // costly things a browser can do (with all that layouting & painting) it is better to generate all the
    // markup to be inserted before & only issue one insert operation
    // It´s even better not to create only markup, but create a DOM node to be inserted instead,
    // thanks to DocumentFragment, we´re able to do this in memory only & have just one insert operation in the end
    // David Walsh wrote a great article about this back in the day when this was the hot shit :D
    // see: https://davidwalsh.name/documentfragment

    // Create a DocumentFragment
    // see: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
    const palettes_fragment = document.createDocumentFragment();
    // loop over the markup array (each array item contains markup for one colorbox)
    palettes_markup.forEach(function __append_markup_to_docfrag(markup) {
        // Create a placeholder element
        // This element will never be inserted into the DOM, we only need it as an
        // container to convert our string markup to DOM nodes (as an alternative to `innerHTML`)
        // see: https://developer.mozilla.org/de/docs/Web/API/Document/createElement
        let container_element = document.createElement('span');
        // We use `insertAdjacentHTML` to insert the markup into our container element
        // We don't use `innerHTML`for onse reason, `innerHTML` is a setter & a getter at the same time
        // using a function like `insertAdjacentHTML` we make our intend clearer (to the person who reads the code)
        // that we want to insert something instead of reading the contents
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        container_element.insertAdjacentHTML('afterbegin', markup);
        // We get the first child element from our container element (which is basically the <div class='card card-1'> from our markup)
        // and append this to our document fragment
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
        palettes_fragment.appendChild(container_element.firstElementChild);
    })
    // Finally, we´re using our fragment & insert it into the DOM, the fragment now contains a list of DOM nodes:
    // <div class='card card-1'>...</div>
    // <div class='card card-1'>...</div>
    // <div class='card card-1'>...</div>
    document.body.appendChild(palettes_fragment);
}

// Creates the markup for one colorbox item
function create_colourbox_markup(colour) {
    return `<div class='mini--box' style='background: #${colour};'></div>`
}

// creates the markup for one palette item
function create_palette_markup(palette) {
    // NOTE
    // You´ve used `var arrayLength` here, as you´ve already used `let` & `const` before,
    // there is actually no need to use `var`, `let` and `const` are already enough (and better suited for our purpose)
    // see: https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f
    // see: https://github.com/i0natan/nodebestpractices#-37-prefer-const-over-let-ditch-the-var

    // NOTE
    // Instead of using a for loop, we´re again making use of `map` & extracting the code into a separate function
    // It will, again, return an array with the containing markup. So we will just use the `join()` operation to
    // turn that array into a string
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    const colorbox_markup = palette.colors.map(create_colourbox_markup).join('');

    // format the creation date
    const palette_date_created = format_date(palette.dateCreated);
    // create the markup for the palette item
    const markup = `
        <div class='card card-1'>
           <div class='container'>
                ${palette.title}
                <span class='end'>${palette_date_created}</span>
                <p>
                    <span class='big-number'> ${palette.numViews} </span> views &nbsp;
                    <span class='big-number'> ${palette.numVotes} </span> votes &nbsp;
                    <span class='big-number'> ${palette.numComments} </span> comments &nbsp;
                    <span class='big-number'> ${palette.numHearts} </span> hearts &nbsp;
                </p>
            </div>
            <div class='box'>${colorbox_markup}</div>
        </div>`;
    return markup;
}

// NOTE
// This again might be a bit confusing, but hold on, I´m trying to walk you through this
// What you see here is called an IIFE (Immediately Invoked Function Expression)
// see: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
// Basically we wrap all the init code (it was the `XMLHttpRequest` in your old one that kickstarted the script)
// into a function that gets executed immediately
// Instead of writing it using this syntax we could´ve done the same using a more fmailiar syntax
// function init(){ fetch_palettes()...etc }
// init();
// which would have the same effect, but writing it as an IIFE is a common way to signal other developers
// that this is the starting point of our script
// The highest rated answer to this Stack Overflow function does a terrific job explaining it in detail
// see: https://stackoverflow.com/questions/8228281/what-is-the-function-construct-in-javascript
(function __init(){
    // fetch the data from the API & execute `__create_palettes_markup_and_insert` once the data is returned & no error happened 
    fetch_palettes().then(function __create_palettes_markup_and_insert(palettes) {
        // create the markup for our palettes
        const palettes_markup = create_palettes_markup(palettes)
        // insert the created markup into our DOM as children of the <body> element
        insert_palettes(palettes_markup)
    })
})()
