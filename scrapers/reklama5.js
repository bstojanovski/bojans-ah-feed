
// Reklama5
const cheerio = require('cheerio');
const request = require('request');
const Oglas = require('../classes/oglas.js');

const promiseReklama5 = new Promise((resolve, reject) => {
    // Define IDs of cities
    // Ohrid = 305
    // Struga = 14
    let citiesReklama5 = [305, 14];
    let priceRange = {from: 10000, to: 35000};

    // Reklama5 requests
    citiesReklama5.forEach(cityID => {
        request({method: 'GET', url: 'http://www.reklama5.mk/Search?q=&city='+ cityID +'&sell=0&sell=1&buy=0&rent=0&includeforrent=0&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&f45_from=&f45_to=&f46_from=&f46_to=&priceFrom='+ priceRange.from +'&priceTo='+ priceRange.to +'&f48_from=&f48_to=&f47=&f10029=&f10030=&f10040=&private=0&company=0&page=1&SortByPrice=0&zz=1&cat=159'}, (err, res, body) => {
            if (err) return reject(err);
            let $ = cheerio.load(body);
            let data = $('.OglasResults');
            let matchingListings = [];

            $(data).each(function() {
                let url = 'https://www.reklama5.mk' + $(this).find('.text-left.text-info a').attr('href');
                let date = $(this).find('.adDate').text();
                date = date.substring(0, 6) + '. ' + date.substring(6);
                let title = $(this).find('.SearchAdTitle').text().substr(1);
                let price = parseInt($(this).find('.text-left.text-success').text().replace('.', ''));
                const oglas = new Oglas(url, date, title, price);

                // Check conditions (price)
                if(oglas.conditions) {
                    matchingListings.push(oglas);
                }
            });

            resolve(matchingListings.slice(0, 3));
        });
    });
});

module.exports = promiseReklama5;