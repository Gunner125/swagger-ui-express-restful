/****
 * User register.
 **/
exports.userRegister = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {

            resolve({ status: 200, message: 'result back' });

        })().catch(function (err) {
            console.log('[error on catch] : ' + err);
            reject({ status: 500, message: 'Something Error' });
        });

    });
};