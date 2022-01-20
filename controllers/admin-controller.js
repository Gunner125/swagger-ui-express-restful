const msgConstant = require("../constant/messageMapping");
const mongoConnector = require("../connector/mongodb");
const utils = require('../utils/string');
const fs = require('fs');

/****
 * Customer register.
 **/
exports.productCreate = (req) => {
    return new Promise(function (resolve, reject) {
        (async () => {
            console.log(req.body);
            // const { firstname, lastname, username, password, age } = req.body;

            // const customerCollec = mongoConnector.api.collection('Customer');

            // const duplicatedCustomer = await customerCollec.findOne({ username: username });

            // if (duplicatedCustomer) return reject(msgConstant.customer.duplicate_customer);

            // const encryptedPassword = await utils.encryptPassword(password);

            // await customerCollec.insertOne({
            //     firstname: firstname,
            //     lastname: lastname,
            //     username: username,
            //     password: encryptedPassword,
            //     age: age,
            //     registerDate: new Date()
            // });

            resolve(msgConstant.customer.register_success);
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject({ status: 500, message: 'Something Error' });
        });
    });
};