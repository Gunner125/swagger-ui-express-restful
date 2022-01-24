const jwt = require("jsonwebtoken");
const respConvert = require("../utils/response.converter");
const msgConstant = require("../constant/message.mapping");

exports.auth = async (req, res) => {
      return new Promise(function (resolve, reject) {
            (async () => {
                  const { accessToken, refreshToken } = req.cookies;

                  //Check if access token is valid
                  if (!accessToken) return reject(msgConstant.auth.token_not_found);

                  //check if acccess toekn is expried?
                  const isAccessTokenExpire = isTokenExpired(accessToken);
                  const isRefreshTokenExpire = isTokenExpired(refreshToken);

                  if (isAccessTokenExpire && isRefreshTokenExpire) return reject(msgConstant.auth.refresh_token_exprire);

                  //If access token exprie, check refresh token 
                  //If not, generate new accessToken by using refreshToken
                  if (isAccessTokenExpire) {
                        if (isRefreshTokenExpire) return reject(msgConstant.auth.refresh_token_exprire);

                        const decoded = jwt.decode(refreshToken, '123456789_SECRET');

                        const generatedNewAccessToken = jwt.sign(
                              {
                                    _id: decoded._id,
                                    username: decoded.username,
                                    role: decoded.role,
                              },
                              '123456789_SECRET',
                              { expiresIn: '3h' }
                        );

                        req.auth = decoded;
                        res.cookie('accessToken', generatedNewAccessToken, { httpOnly: true });
                        return resolve();
                  } else {
                        req.auth = jwt.decode(accessToken, '123456789_SECRET');
                        return resolve();
                  }

            })().catch((err) => {
                  console.error('[Something error in auth] : ' + err.message);
                  return reject(respConvert.systemError(err));
            });
      });
};

function isTokenExpired(token) {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
      const decoded = JSON.parse(decodedJson);
      const exp = decoded.exp;
      const expired = (Date.now() >= exp * 1000);
      return expired;
}