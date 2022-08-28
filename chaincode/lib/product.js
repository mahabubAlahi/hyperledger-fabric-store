'use strict';

/**
 * The Estore Product model.
 */
class Product {
    constructor(vendor, name, price, owner, bought) {
        this.vendor = vendor;
        this.name = name;
        this.price = price;
        this.owner = owner;
        
        if (bought === 'true' || bought === true) {
            this.bought = true;
        } else {
            this.bought = false;
        }
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getIsBought() {
        return this.bought;
    }

    setIsBought() {
        this.bought = true;
    }

    static deserialize(data) {
        return new Product(data.vendor, data.name, data.price, data.owner, data.bought);
    }
}

module.exports = Product;