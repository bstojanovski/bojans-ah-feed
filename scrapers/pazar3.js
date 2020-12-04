// Pazar3
const cheerio = require('cheerio');
const request = require('request-promise');
const Oglas = require('../classes/oglas.js');

async function scrapePazar3(cityID, priceRange) {
    var options = {
        uri: 'https://www.pazar3.mk/oglasi/zivealista/stanovi/se-prodava/'+ cityID +'?PriceFrom='+ priceRange.from +'&PriceTo='+ priceRange.to,
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    try {
        let matches = [];
        const $ = await request(options);
        let data = $('.row-listing');

        $(data).each(function() {
            let url = 'https://www.pazar3.mk' + $(this).find('.title h2 a').attr('href');
            let date = $(this).find('.title .pull-right.text-right').text().replace(/(\r\n|\n|\r)/gm,"");
            let title = $(this).find('.title h2 a').text();
            let price = parseInt($(this).find('.title .list-price').text().replace(' ', ''));
            const oglas = new Oglas(url, date, title, price);

            // Check conditions (price)
            // and duplicates
            if(oglas.conditions && !matches.find((item)=>item.title===title)) {
                if(date.startsWith("Денес") || date.startsWith("Вчера")) {
                    matches.unshift(oglas);
                } else {
                    matches.push(oglas);
                }
            }
        });

        let sliceNumber = 5;

        if(cityID == 'ohrid') {
            sliceNumber = 7;
        }

        return matches.slice(0, sliceNumber);
    } catch (error) {
        console.log(error);
    }
}

module.exports = scrapePazar3;