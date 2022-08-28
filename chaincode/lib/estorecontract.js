'use strict';

// Fabric smart contract class
const { Contract } = require('fabric-contract-api');

// The Product model
const Product = require('./product.js');

/**
 * The e-store smart contract
 */

 class EStoreContract extends Contract {

    async initLedger(ctx) {
        const products = [
            {
                vendor: 'apple',
                name: 'airpods',
                price: '1000',
                owner: 'apple',
                bought: false
            },
            {
                vendor: 'microsoft',
                name: 'office-suite',
                price: '500',
                owner: 'microsoft',
                bought: false
            }
        ];

        for (let i = 0; i < products.length; i++) {
            await this.releaseProduct(ctx, products[i].vendor, products[i].name, products[i].price, 
                products[i].owner, products[i].bought);
        }

        return products;
    }

    async releaseProduct(ctx, vendor, name, price, owner, bought) {
        // Create a composite key 'PROD{vendor}{name}' for this product.
        let key = ctx.stub.createCompositeKey('PROD', [vendor, name]);
        // Create a new product object with the input data.
        const product = new Product(vendor, name, price, owner, bought);

        // Save the product in the datastore.
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }

    async buyProduct(ctx, vendor, name, newOwner) {
        // Retrieve the product from the store based on its vendor and name.
        const key = ctx.stub.createCompositeKey('PROD', [vendor, name]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const product = Product.deserialize(JSON.parse(productAsBytes.toString()));

        // Check whether the product has already been bought.
        if (product.getIsBought()) {
            throw new Error(`${key} is not available for purchase`);
        }

        // Update the product in the data store.
        product.setOwner(newOwner);
        product.setIsBought();
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }
 }

 module.exports = EStoreContract;