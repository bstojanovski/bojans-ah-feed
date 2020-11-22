const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const getScraps = require('./controller.js');

app.set('view engine', 'pug');
app.get('/', (req, res) => {
    getScraps(req.query.city, req.query.price)
        .then(data => {
            res.render("index", {
                title: "Bojan's AH Feed", 
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
app.use(express.static('public'));
app.listen(port, () => console.log('The feed is up and running on http://localhost:' + port));