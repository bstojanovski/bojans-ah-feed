// Oglas class
class Oglas {
    constructor(url, img, date, title, price) {
        this.url = url;
        this.img = img;
        this.date = date;
        this.title = title;
        this.price = price;
    }

    get conditions() {
        return this.checkConditions();
    }

    checkConditions() {
        return (this.price <= 35000 && this.price > 10000);
    }
}

module.exports = Oglas;