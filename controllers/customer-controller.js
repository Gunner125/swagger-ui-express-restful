const msgConstant = require("../constant/messageMapping");
const mongoConnector = require("../connector/mongodb");
const utils = require('../utils/string');
const fs = require('fs');

/****
 * Customer register.
 **/
exports.customerRegister = (req) => {
    return new Promise(function (resolve, reject) {
        (async () => {
            const { firstname, lastname, username, password, age } = req.body;

            const customerCollec = mongoConnector.api.collection('Customer');

            const duplicatedCustomer = await customerCollec.findOne({ username: username });

            if (duplicatedCustomer) return reject(msgConstant.customer.duplicate_customer);

            const encryptedPassword = await utils.encryptPassword(password);

            await customerCollec.insertOne({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: encryptedPassword,
                age: age,
                registerDate: new Date()
            });

            resolve(msgConstant.customer.register_success);
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject({ status: 500, message: 'Something Error' });
        });
    });
};

/****
 * Customer upload slip image.
 **/
exports.uploadImgSlip = (req) => {
    return new Promise(function (resolve, reject) {
        (async () => {

            const imgFile = req.file;

            if (!imgFile) return reject(msgConstant.customer.no_image_found);

            const base64Img = new Buffer.from(fs.readFileSync(req.file.path).toString('base64'), 'base64');

            const imageCollec = mongoConnector.api.collection('Image_Slip');

            await imageCollec.insertOne({
                customerId : "1", //Dummay customer ID
                slippImg: base64Img
            });

            resolve(msgConstant.customer.upload_success);
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject({ status: 500, message: 'Something Error' });
        });
    });
};