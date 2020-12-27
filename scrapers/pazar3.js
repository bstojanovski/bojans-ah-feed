// Pazar3
const cheerio = require('cheerio');
const request = require('request-promise');
const Oglas = require('../classes/oglas.js');

async function scrapePazar3(city, priceRange) {
    let citySlug = city;
    let citiesDash = {
        makedonskibrod: 'makedonski-brod',
        demirhisar: 'demir-hisar',
        svetinikole: 'sveti-nikole'
    };

    if(citiesDash[city] !== undefined) {
        citySlug = citiesDash[city];
    }

    let options = {
        uri: 'https://www.pazar3.mk/oglasi/zivealista/stanovi/se-prodava/'+ citySlug +'?PriceFrom='+ priceRange.from +'&PriceTo='+ priceRange.to,
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
            let img = 'https://www.pazar3.mk' + $(this).find('.span2-ad-img-list img').attr('src');
            let date = $(this).find('.title .pull-right.text-right').text().replace(/(\r\n|\n|\r)/gm,"");
            let title = $(this).find('.title h2 a').text();
            let price = parseInt($(this).find('.title .list-price').text().replace(' ', ''));
            const oglas = new Oglas(source, url, img, date, title, price, citySlug);

            // Check conditions (price)
            // and duplicates
            if(oglas.checkConditions(priceRange) && !matches.find((item)=>item.title===title)) {
                matches.push(oglas);
            }
        });

        return matches.slice(0, 5);
    } catch (error) {
        console.log(error);
    }
}

module.exports = scrapePazar3;