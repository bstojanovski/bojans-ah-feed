const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cheerio = require('cheerio');
const request = require('request');
const Feed = require('feed').Feed;

const feed = new Feed({
    title: "Bojans AH Feed",
    description: "Searching for apartments in Ohrid via Reklama5",
    link: "https://bojans-ah-feed.herokuapp.com/",
    image: "https://bojanstojanovski.com/dist/img/portret.jpg",
    favicon: "https://bojanstojanovski.com/favicon.ico",
    copyright: "Content belongs to Reklama5",
    author: {
      name: "Bojan Stojanovski",
      email: "me@bojanstojanovski.com",
      link: "https://bojanstojanovski.com"
    }
  });

request({method: 'GET', url: 'http://www.reklama5.mk/Search?q=&city=305&sell=0&sell=1&buy=0&buy=1&rent=0&rent=1&includeforrent=0&includeforrent=1&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&f45_from=&f45_to=&f46_from=&f46_to=&priceFrom=10000&priceTo=&f48_from=&f48_to=&f47=&f10029=&f10030=&f10040=&private=0&company=0&page=1&SortByPrice=0&zz=1&cat=159'}, (err, res, body) => {
    if (err) return console.error(err);
    let $ = cheerio.load(body);
    let data = $('.OglasResults');
    let oglasi = []; // oglasi = classified ads

    $(data).each(function(i) {
        oglas = []; // oglas = classified ad
        oglas.url = 'http://www.reklama5.mk' + $(this).find('.text-left.text-info a').attr('href');
        oglas.date = $(this).find('.adDate').text();
        oglas.title = $(this).find('.SearchAdTitle').text().substr(1);
        oglas.price = parseInt($(this).find('.text-left.text-success').text().replace('.', ''));

        oglasi[i] = oglas;
    });

    $(oglasi).each(function(i, oglas) {
        if(oglas.price < 20000 && oglas.price > 10000) {
            feed.addItem({
                title: oglas.title,
                link: oglas.url,
                description: oglas.price.toString(),
                content: oglas.date.toString()
            });
        }
    });
    
    app.get('/', (req, res) => res.set('Content-Type', 'application/rss+xml').send(feed.rss2()))
    app.listen(port, () => console.log(`The feed is up and running!`))
}); 