// Reklama5
// IDs of cities
// Ohrid = 305
// Struga = 14
const cheerio = require('cheerio');
const request = require('request-promise');
const Oglas = require('../classes/oglas.js');

async function scrapeReklama5(cityID, priceRange) {
    var options = {
        uri: 'http://www.reklama5.mk/Search?q=&city='+ cityID +'&sell=0&sell=1&buy=0&rent=0&includeforrent=0&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&f45_from=&f45_to=&f46_from=&f46_to=&priceFrom='+ priceRange.from +'&priceTo='+ priceRange.to +'&f48_from=&f48_to=&f47=&f10029=&f10030=&f10040=&private=0&company=0&page=1&SortByPrice=0&zz=1&cat=159',
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    try {
        let matches = [];
        const $ = await request(options);
        let data = $('.OglasResults');

        $(data).each(function() {
            let url = 'https://www.reklama5.mk' + $(this).find('.text-left.text-info a').attr('href');
            let date = $(this).find('.adDate').text();
            date = date.substring(0, 6) + '. ' + date.substring(6);
            let title = $(this).find('.SearchAdTitle').text().substr(1);
            let price = parseInt($(this).find('.text-left.text-success').text().replace('.', ''));
            const oglas = new Oglas(url, date, title, price);

            // Check conditions (price)
            if(oglas.conditions) {
                matches.push(oglas);
            }
        });

        let sliceNumber = 3;

        if(cityID == 305) {
            sliceNumber = 7;
        }

        return matches.slice(0, 3);
    } catch (error) {
        console.log(error);
    }
}

module.exports = scrapeReklama5;