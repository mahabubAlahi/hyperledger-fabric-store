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
 }

 module.exports = EStoreContract;