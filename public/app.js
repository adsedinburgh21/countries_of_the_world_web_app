window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    ///// this is the ajax request above and we have made it an object called 'request'. We then call functions on this request object below.
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            ///// The '.responseText' just selects all of the info/data from the url that we have requested in the GET request above (it will be in string form) and we set this to a variable 'jsonString' so that we can then parse it below. 
            var countries = JSON.parse(jsonString);
            //// The parse just turns the string (the info/data) we get from the API into a javascript object (a big collection/array type thing with all the info of all the countries) that we can then use.
            main(countries);
        }
    }
    request.send(null);
    //// this is the request to 'run' the ajax request. eg line 3 we make a new ajax request, line 5 we set the ajax as a get request asking for the url info of the REST countries API, then we attach an '.onload' to the ajax request which will wait for the page to be loaded before running the stuff inside its function. The request.send(null) is just sending off the ajax request but the info it loads isnt used until the page is loaded (the onload part)

};



var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }  //// if there is something saved in local storage then we parse what was stored (everything stored in local storage is a string so we need to parse it to make it back into an object we can use). Then we make the currently selected index (.selectedIndex) of the drop down list (in the html section with id=countries) equal to the index number of what country we had saved in local storage, so when the page is refreshed it will display on the drop down list the country that we had in local storage (the last country we selected) .
    updateDisplay(selected);
    updateMap( selected );
    document.querySelector('#info').style.display = 'block';
    ////// This line above sets the display to block. It is set in the index.html to be display:none which means it wont be visable until the line above changes the display to block and makes it visible in the browser.
};


var populateSelect = function (countries) {
    
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        // The item.index is not using the index passed in above, its just setting the the key 'index' in the item object to have a value of the 'index' which is what we passed in above.
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    

    /// /// EVENT LISTENER LOOKING FOR DROPDOWN MENU TO BE CHANGED
    parent.addEventListener('change', function (event) {
        // console.log('index', this.selectedIndex)
        // console.log("onchange", this)
        var index = this.options[this.selectedIndex].value;
        //// .selectedIndex is an HTML function that returns the index of what ever is selected. it needs to be run on a selected piece of code - a parent - which we get by doing something like '.getElementById()' or '.querySelector()'. In this case, 'this' is refering to the parent on line 35 which has already selected the html id countries (.querySelector(#countries) ) which is the whole html 'select' (<select>...</select>).
            //// if replace 'this' in line above with what 'this' actually is it would look like: select.options[select.selectedIndex].value  , select.selectedIndex is just a number (its the index of whats currently selected inside the 'select' html tags) and 'select.options[number].value' returns whatever the 'value' tag is of the html 'option' tag (that we have specified by its index number) thats inside the html 'select' tag - in other words, the index number.
        //////  in this case 'select.selectedIndex' will give the same number as the whole line ( select.options[select.selectedIndex].value ) but if we did something to our original data (eg our countries array- if we deleted a country or sorted them in a different way eg reverse alphabetical order) then 'select.selectedIndex' might not be the same as ( select.options[select.selectedIndex].value ) so we need the full line.
            // console.log( this.selectedIndex);
            // console.log( this.options[this.selectedIndex].value );
        var country = countries[index];
        updateDisplay( country );
        updateMap( country );
        localStorage.setItem("selectedCountry",JSON.stringify(country));
        //// local storage line is how it we persist the last country that was selected so even if we refresh the page it will keep displaying the last country that we selected. This is called back out of local storage in the 'main' constructor above.
    }, false);
};

var updateDisplay = function (country) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = country.name;
    tags[1].innerText = "Population: " + country.population;
    tags[2].innerText = "Capital City: " + country.capital;
    tags[3].innerText = "Time Zones: " + country.timezones;
    tags[4].innerText = "Borders: " + country.borders;
    tags[5].innerText = "Co-ordinates:  Latitude = " + country.latlng[0] + ",  Longitude = " + country.latlng[1];
}; //// Here the query selector has selected the id 'info p' which selects all of the 'p' tags inside the div with id=info and set them to be a variable called tags. its a collection/array so to get each individual p we use the index numbers on tags.

var updateMap = function( country) {
    var lat = country.latlng[0];
    var lng = country.latlng[1];
    var map = new Map({ lat: lat, lng: lng }, 5);
    // map.addMarker( { lat: lat, lng: lng }, country.name.toString());
    map.addInfoWindow( { lat: lat, lng: lng }, country.name.toString() )
};

