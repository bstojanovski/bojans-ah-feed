// Reklama5
// IDs of cities
// Ohrid = 305
// Struga = 14
// Skopje = 1
// Tetovo = 5
const cheerio = require('cheerio');
const request = require('request-promise');
const Oglas = require('../classes/oglas.js');
let citiesMap = {
    all: '',
    skopje: 1,
    bitola: 2,
    kumanovo: 3,
    prilep: 4,
    tetovo: 5,
    veles: 6,
    stip: 7,
    ohrid: 8,
    gostivar: 9,
    strumica: 10,
    kavadarci: 11,
    kocani: 12,
    kicevo: 13,
    struga: 14,
    radovis: 15,
    gevgelija: 16,
    debar: 17,
    krivapalanka: 18,
    svetinikole: 19,
    negotino: 20,
    delcevo: 21,
    vinica: 22,
    resen: 23,
    probistip: 24,
    berovo: 25,
    kratovo: 26,
    demirhisar: 34,
    krusevo: 28,
    makedonskibrod: 29,
    valandovo: 30
}

async function scrapeReklama5(type, query, city, priceRange) {
    // City ID mapping
    // Default search for apartments
    let params = {
        searchQuery: '',
        cityID: citiesMap[city],
        category: 159
    }

    // Search for cars
    if(type == 'cars') {
        // Car Brand ID mapping
        params = {
            searchQuery: query,
            cityID: citiesMap[city],
            category: 24
        }
    }

    let options = {
        uri: 'http://www.reklama5.mk/Search?q='+ params.searchQuery +'&city='+ params.cityID +'&sell=0&sell=1&buy=0&rent=0&includeforrent=0&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&f45_from=&f45_to=&f46_from=&f46_to=&priceFrom='+ priceRange.from +'&priceTo='+ priceRange.to +'&f48_from=&f48_to=&f47=&f10029=&f10030=&f10040=&private=0&company=0&page=1&SortByPrice=0&zz=1&cat='+ params.category,
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    try {
        let matches = [];
        const $ = await request(options);
        let data = $('#sr-holder .row');

        $(data).each(function() {
            let source = "reklama5";
            let url = 'https://www.reklama5.mk' + $(this).find('.SearchAdTitle').attr('href');
            let img = $(this).find('.ad-image').css('background-image').replace(/(url\(|\)|")/g, '');;
            let date = $(this).find('.ad-date-div-1').text().replace(/\s/g,'');
            let title = $(this).find('.SearchAdTitle').text().substr(1);
            let city = $(this).find('.city-span').text().replace(/(\r\n|\n|\r)/gm,"");
            let price = parseInt($(this).find('.search-ad-price').text().replace('.', ''));
            let currency = $(this).find('.search-ad-price').text().split('\n ')[2].replace(/(\r\n|\n|\r)/gm,"").charCodeAt(0);

            // Only € is a valid currency
            // € = 8364
            if(currency == 8364) {
                const oglas = new Oglas(source, url, img, date, title, price, city);

                // Check conditions (price)
                // and duplicates
                if(oglas.checkConditions(priceRange) && !matches.find((item)=>item.title===title)) {
                    matches.push(oglas);
                }
            }
        });

        return matches.slice(0, 5);
    } catch (error) {
        console.log(error);
    }
}

module.exports = scrapeReklama5;