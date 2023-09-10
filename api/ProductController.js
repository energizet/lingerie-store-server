import Response from '../Response.js';
import fs from "fs";

class ProductController {
    #products;

    constructor() {
        let baseUrl = `${process.env.SSL === 'true' ? 'https' : 'http'}://${process.env.ADDRESS}:${process.env.PORT}`;

        let productsPath = new URL('./products.json',import.meta.url);
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

export default new ProductController();