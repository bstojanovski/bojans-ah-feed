// Pazar3
const cheerio = require('cheerio');
const request = require('request-promise');
const Oglas = require('../classes/oglas.js');

async function scrapePazar3(type, query, city, priceRange) {
    // City ID mapping
    // Default search for apartments
    let citySlug = city;
    let citiesDash = {
        all: '',
        makedonskibrod: 'makedonski-brod',
        demirhisar: 'demir-hisar',
        svetinikole: 'sveti-nikole'
    };
    if(citiesDash[city] !== undefined) {
        citySlug = citiesDash[city];
    }

    let params = {
        city: '/' + citySlug,
        searchQuery: '/q-' + query,
        queryString: 'zivealista/stanovi'
    }

    // Search for cars
    if(type == 'cars') {
        params.queryString = 'vozila/avtomobili';
    }

    let options = {
        uri: 'https://www.pazar3.mk/oglasi/'+ params.queryString +'/se-prodava'+ params.city + params.searchQuery +'?PriceFrom='+ priceRange.from +'&PriceTo='+ priceRange.to,
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    try {
        let matches = [];
        const $ = await request(options);
        let data = $('.row-listing');

        $(data).each(function() {
            let source = "pazar3";
            let url = 'https://www.pazar3.mk' + $(this).find('.title h2 a').attr('href');
            let img = $(this).find('img.img-polaroid').attr('data-src');
            if(img == 'https://www.pazar3.mk/Content/Images/skeleton.svg') {
                img = '';
            }
            let date = $(this).find('.title .pull-right.text-right').text().replace(/\s/g,'');
            let title = $(this).find('.title h2 a').text();
            let city = $(this).find('.link-html5.nobold').eq(1).text();
            let price = parseInt($(this).find('.title .list-price').text().replace(' ', ''));
            let currency = $(this).find('.title .list-price').text().split(' ')[2].replace(/(\r\n|\n|\r)/gm,"");

            // Only EUR is a valid currency
            if(currency == 'ЕУР') {
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

module.exports = scrapePazar3;