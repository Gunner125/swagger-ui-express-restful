// const msgConstant = require("../constant/messageMapping");

exports.success = (resObj) => {
      return {
            status: resObj.status,
            message: resObj.message
      };
};

exports.successWithData = (resObj, data) => {
      let returnObj = {};

      returnObj.status = resObj.status;
      returnObj.message = resObj.message;

      if (data) returnObj.data = data;

      return returnObj;
};

exports.validateError = function (resObj) {
      return {
            status: resObj.status,
            message: resObj.message
      };
};

exports.systemError = (error) => {
      return {
            status: 500,
            message: error.message
      };
};

