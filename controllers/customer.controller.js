const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const msgConstant = require("../constant/message.mapping");
const respConvert = require("../utils/response.converter");
const utils = require('../utils/string');

const customerModel = require('../models/customer.model');
const imageSlipModel = require('../models/imageSlip.model');
const productModel = require('../models/product.model');

/****
 * Customer register.
 **/
exports.customerRegister = (req) => {
    return new Promise(function (resolve, reject) {
        (async () => {
            const { firstname, lastname, username, password, age } = req.body;

            const duplicatedCustomer = await customerModel.findOne({ username: username });

            if (duplicatedCustomer) return reject(msgConstant.customer.duplicate_customer);

            const encryptedPassword = await utils.encryptPassword(password);

            await customerModel.create({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: encryptedPassword,
                age: age,
                point: 0,
                role: "Customer",
                registerDate: new Date()
            });

            resolve(respConvert.success(msgConstant.customer.register_success));
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};

exports.customerSignIn = async (req, res) => {
    return new Promise(function (resolve, reject) {
        (async () => {
            const { username, password } = req.body;

            const user = await customerModel.findOne({ username: username }, 'username password role');

            if (!user) return reject(msgConstant.customer.user_not_found);

            const passwordIsValid = await utils.comparePassword(password, user.password);

            if (!passwordIsValid) return reject(msgConstant.customer.invalid_password);

            const accessToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, "123456789_SECRET", {
                expiresIn: '3h',
            });

            const refreshToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, "123456789_SECRET", {
                expiresIn: '8h',
            });

            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });

            resolve(respConvert.successWithData(msgConstant.auth.login_success, { accessTooken: accessToken }));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};

/****
 * Customer upload slip image.
 **/
exports.uploadImgSlip = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const imgFile = req.file;

            if (!imgFile) return reject(msgConstant.customer.no_image_found);

            await imageSlipModel.create({
                customer: mongoose.Types.ObjectId(req.auth._id),
                slipImg: imgFile.path,
                slipPoint: 0,
                updDate: new Date()
            });

            resolve(respConvert.success(msgConstant.customer.upload_success));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};

/****
 * Slip list of customer.
 **/
exports.slipList = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {

            const customerSlipList = await imageSlipModel.find({
                customer: mongoose.Types.ObjectId(req.auth._id)
            }, 'customer slipImg slipPoint');

            resolve(respConvert.successWithData(msgConstant.customer.get_data_success, customerSlipList));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};


/****
 * Product list and point for converting.
 **/
exports.productList = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {

            const productList = await productModel.find({}, 'productName productPointUse');

            resolve(respConvert.successWithData(msgConstant.customer.get_data_success, productList));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};

/****
 * Customer point summary.
 **/
exports.pointSummary = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const customerData = await customerModel.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.auth._id)
                }, 'point');

            resolve(respConvert.successWithData(msgConstant.customer.get_data_success, { customerPoint: !customerData.point ? 0 : customerData.point }));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};

/****
 * Customer point convert.
 **/
exports.pointConvert = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const { productId } = req.body;
            const userId = req.auth._id;

            if (!mongoose.Types.ObjectId.isValid(productId) || productId == '' || !productId) {
                return reject(respConvert.validateError(msgConstant.customer.product_id_validate_fail));
            }

            const checkProductId = await productModel.exists({ _id: mongoose.Types.ObjectId(productId) });
            if (!checkProductId) {
                return reject(respConvert.validateError(msgConstant.customer.product_id_validate_fail));
            }

            const productData = await productModel.findOne({
                _id: mongoose.Types.ObjectId(productId)
            }, 'productName productPointUse');

            const customerData = await customerModel.findOne({
                _id: mongoose.Types.ObjectId(userId)
            }, 'username point');

            if (customerData.point < productData.productPointUse) {
                return reject(respConvert.validateError(msgConstant.customer.convert_point_not_enough));
            }

            let convertPointObj = {
                productId: mongoose.Types.ObjectId(productId),
                convertedPoint: productData.productPointUse,
                convertDate: new Date(),
            };

            //converting point by decresing customer's point.
            await customerModel.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(customerData._id) },
                {
                    $inc: {
                        point: -Math.abs(productData.productPointUse)
                    },
                    $push: { convertPointHistory: convertPointObj }
                }
            );

            resolve(respConvert.success(msgConstant.customer.point_convert_success));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};

/****
 * History of converted product and point.
 **/
exports.pointConvertedHistory = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const userId = req.auth._id;

            const customerConvertHistory = await customerModel.findOne({
                _id: mongoose.Types.ObjectId(userId)
            }, 'productId.productName convertedPoint convertDate').populate({
                path: 'convertPointHistory',
                populate: {
                    path: 'productId',
                    model: 'Product',
                    select: 'productName'
                }
            });

            resolve(respConvert.successWithData(msgConstant.customer.get_data_success, customerConvertHistory));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};