exports.writeSuccess = function (response, objMessage) {
    var objResponse = {};

    objResponse.code = objMessage.status;
    objResponse.message = objMessage.message;

    if (objMessage.data) objResponse.data = objMessage.data;
    // if (objMessage.token) objResponse.token = objMessage.token
    // if (objMessage.newToken) objResponse.newToken = objMessage.newToken

    // console.log('Success ' + JSON.stringify(objResponse))
    response.setHeader('Content-Type', 'application/json');
    response.status(objResponse.code);
    response.json({ code: objResponse.code, message: objResponse.message });
};

exports.writeError = function (response, objMessage) {
    var objResponse = {};

    objResponse.code = objMessage.status;
    objResponse.message = objMessage.message;

    // console.log('Error ' + JSON.stringify(objResponse))
    response.setHeader('Content-Type', 'application/json');
    response.status(200);
    response.json(objResponse);
};