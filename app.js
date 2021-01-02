const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const getScraps = require('./controller.js');
let path = '/';

if(env == 'production') {
    path = '/playground/ah-feed/'; // The path I use on my server
}
let citiesListTranslation = {
    all: 'Цела Македонија',
    tetovo: 'Тетово',
    ohrid: 'Охрид',
    struga: 'Струга',
    skopje: 'Скопје',
    gostivar: 'Гостивар',
    veles: 'Велес',
    prilep: 'Прилеп',
    bitola: 'Битола',
    kumanovo: 'Куманово',
    svetinikole: 'Свети Николе',
    strumica: 'Струмица',
    kavadarci: 'Кавадарци',
    kocani: 'Кочани',
    kicevo: 'Кичево',
    radovis: 'Радовиш',
    gevgelija: 'Гевгелија',
    debar: 'Дебар',
    krivapalanka: 'Крива Паланка',
    negotino: 'Неготино',
    delcevo: 'Делчево',
    vinica: 'Виница',
    resen: 'Ресен',
    stip: 'Штип',
    probistip: 'Пробиштип',
    berovo: 'Берово',
    krusevo: 'Крушево',
    valandovo: 'Валандово'
}

app.set('view engine', 'pug');
app.use(path, express.static('public'));

// Apartments
app.get(path, (req, res) => {
    let query = req.query.query;
    let city = req.query.city;
    let price = req.query.price;
    let sortby = req.query.sortby;
    let type = 'apartments';

    // Redirect to default values
    if(city == undefined) {
        res.redirect('?city=struga,ohrid&price=10000,35000');
    }

    getScraps(query, city, price, sortby, type)
        .then(data => {
            res.render("index", {
                title: "Bojan's AH Feed", 
                path: path,
                selectedCities: city,
                priceRange: price,
                citiesListTranslation: citiesListTranslation,
                scraps: data
            })
        })
        .catch(e => {
            res.status(500, {
                error: e
            });
        })
        .catch((e) => {
            console.log(e);
        });
});

// Cars
app.get(path + 'cars/', (req, res) => {
    let query = req.query.query;
    let city = req.query.city;
    let price = req.query.price;
    let sortby = req.query.sortby;
    let type = 'cars';

    // Redirect to default values
    if(city == undefined) {
        res.redirect('?query=&city=all&price=1000,10000');
    }

    getScraps(query, city, price, sortby, type)
        .then(data => {
            res.render("cars-index", {
                title: "Bojan's AH Feed", 
                path: path,
                query: query,
                selectedCities: city,
                priceRange: price,
                citiesListTranslation: citiesListTranslation,
                scraps: data
            })
        })
        .catch(e => {
            res.status(500, {
                error: e
            });
        })
        .catch((e) => {
            console.log(e);
        });
});

// RSS Feed
app.get(path + 'rss', (req, res) => {
    let query = req.query.query;
    let city = req.query.city;
    let price = req.query.price;
    let sortby = req.query.sortby;
    let type = 'apartments';

    getScraps(query, city, price, sortby, type, true)
        .then(data => {
            res.set('Content-Type', 'application/rss+xml').send(data.rss2());
        })
        .catch(e => {
            res.status(500, {
                error: e
            });
        })
        .catch((e) => {
            console.log(e);
        });
});
app.listen(port, () => console.log('The feed is up and running on http://localhost:' + port));