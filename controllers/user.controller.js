const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const msgConstant = require("../constant/message.mapping");
const utils = require('../utils/string');
const respConvert = require("../utils/response.converter");

const productModel = require('../models/product.model');
const userModel = require('../models/user.model');
const imageSlipModel = require('../models/imageSlip.model');
const customerModel = require('../models/customer.model');

/****
 * User sign in.
 **/
exports.userSignIn = async (req, res) => {
    return new Promise(function (resolve, reject) {
        (async () => {
            const { username, password } = req.body;

            const user = await userModel.findOne({ username: username }, 'name username password role');

            if (!user) return reject(msgConstant.user.user_not_found);

            const passwordIsValid = utils.comparePassword(password, user.password);

            if (!passwordIsValid) return reject(msgConstant.user.invalid_password);

            const accessToken = jwt.sign({ _id: user._id, name: user.name, username: user.username, role: user.role }, "123456789_SECRET", {
                expiresIn: '3h',
            });

            const refreshToken = jwt.sign({ _id: user._id, name: user.name, username: user.username, role: user.role }, "123456789_SECRET", {
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
 * Product create.
 **/
exports.productCreate = (req) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const { productName, productPointUse } = req.body;

            if (productName == '' || !productName || productPointUse < 0) {
                return reject(respConvert.validateError(msgConstant.user.product_validate_fail));
            }

            await productModel.create({
                productName: productName,
                productPointUse: productPointUse,
                cr_by: mongoose.Types.ObjectId(req.auth._id),
                cr_date: new Date()
            });

            resolve(msgConstant.user.product_created);
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });


    });
};

/****
 * Slip list of Admin for given point.
 **/
exports.slipList = (req, res) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const customerSlipList = await imageSlipModel.find({}, 'slipImg slipPoint').populate({ path: 'customer', select: 'username' });

            resolve(respConvert.successWithData(msgConstant.customer.get_data_success, customerSlipList));
        })().catch((err) => {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};


/****
 * Slip given point 
 **/
exports.slipGivenPoint = (req) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const { slipId, pointGiven } = req.body;

            if (!mongoose.Types.ObjectId.isValid(slipId) || slipId == '' || !slipId || pointGiven < 0 || !pointGiven) {
                return reject(respConvert.validateError(msgConstant.user.slip_data_validate_fail));
            }

            const checkSlipId = await imageSlipModel.exists({ _id: mongoose.Types.ObjectId(slipId) });
            if (!checkSlipId) {
                return reject(respConvert.validateError(msgConstant.user.slip_id_validate_fail));
            }

            //update point for slip record
            const response = await imageSlipModel.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(slipId)
            },
                {
                    $set: {
                        slipPoint: pointGiven,
                        givenBy: mongoose.Types.ObjectId(req.auth._id),
                        givenStatus: true,
                        updDate: new Date()
                    }
                }
            );

            //update point of customer
            await customerModel.findByIdAndUpdate(response.customer, { $inc: { point: pointGiven } });

            resolve(msgConstant.user.slip_point_gived);
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });


    });
};


/****
 * Admin register.
 **/
exports.register = (req) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const { name, username, password } = req.body;

            const duplicatedUser = await userModel.findOne({ username: username });

            if (duplicatedUser) return reject(msgConstant.user.duplicate_user);

            const encryptedPassword = await utils.encryptPassword(password);

            await userModel.create({
                name,
                username,
                password: encryptedPassword,
                role: 'Admin',
                createDatetime: new Date()
            });

            resolve(respConvert.success(msgConstant.user.register_success));
        })().catch(function (err) {
            console.error('[error on catch] : ' + err);
            reject(respConvert.systemError(err));
        });
    });
};