// Pazar3
const cheerio = require('cheerio');
const request = require('request');
const Oglas = require('../classes/oglas.js');

const scrapePazar3 = new Promise((resolve, reject) => {
    // Define IDs of cities
    // Ohrid = ohrid
    // Struga = struga
    let citiesPazar3 = ["ohrid", "struga"];
    let priceRange = {from: 10000, to: 35000};

    // Pazar3 requests
    citiesPazar3.forEach(function(cityID) {
        request({method: 'GET', url: 'https://www.pazar3.mk/oglasi/zivealista/stanovi/se-prodava/'+ cityID +'?PriceFrom='+ priceRange.from +'&PriceTo='+ priceRange.to}, (err, res, body) => {
            if (err) return reject(err);
            let $ = cheerio.load(body);
            let data = $('.row-listing');
            let matchingListings = [];

            $(data).each(function() {
                let url = 'https://www.pazar3.mk' + $(this).find('.title h2 a').attr('href');
                let date = $(this).find('.title .pull-right.text-right').text();
                let title = $(this).find('.title h2 a').text();
                let price = parseInt($(this).find('.title .list-price').text().replace(' ', ''));
                const oglas = new Oglas(url, date, title, price);
                
                // Check conditions (price)
                if(oglas.conditions) {
                    matchingListings.push(oglas);
                }
            });

            resolve(matchingListings.slice(0, 10));
        });
    });
});

module.exports = scrapePazar3;