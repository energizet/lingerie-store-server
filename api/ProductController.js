'use strict';

const Response = require('../Response');
const fs = require("fs");
const path = require("path");

class ProductController {
    #products;

    constructor() {
        let baseUrl = `${process.env.SSL === 'true' ? 'https' : 'http'}://${process.env.ADDRESS}:${process.env.PORT}`;

        let productsPath = path.join(__dirname, 'products.json');
        let productsJson = fs.readFileSync(productsPath)
            .toString();
        this.#products = JSON.parse(productsJson ?? '[]');

        for (const product of this.#products) {
            product.img = product.img?.map(img => {
                if (img[0] === '/') {
                    return baseUrl + img;
                }
                return img;
            });
        }
    }

    async getItems() {
        return Response.ok(this.#products);
    }

    async getItem(id) {
        let item = this.#products.find(item => item.id.toString() === id);
        if (item == null) {
            return Response.error(404, `Item with id(${id}) not found`);
        }
        return Response.ok(item);
    }
}

module.exports = new ProductController();