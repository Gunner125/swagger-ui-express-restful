exports.writeSuccess = function (response, objSend) {
    var objResponse = {};

    objResponse.code = objSend.status;
    objResponse.message = objSend.message;

    if (objSend.data) objResponse.data = objSend.data;

    response.setHeader('Content-Type', 'application/json');
    response.status(objResponse.code);
    response.json(objResponse);
};

exports.writeError = function (response, objMessage) {
    var objResponse = {};

    objResponse.code = objMessage.status;
    objResponse.message = objMessage.message;

    response.setHeader('Content-Type', 'application/json');
    response.status(200);
    response.json(objResponse);
};