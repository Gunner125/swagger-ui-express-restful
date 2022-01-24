const bcrypt = require('bcrypt');

exports.encryptPassword = async (password) => {
      const encryptedPassword = await bcrypt.hash(password, 10);
      return encryptedPassword;
};

exports.comparePassword = async (password, userPassword) => {
      const passwordIsValid = bcrypt.compare(password, userPassword);
      return passwordIsValid;
};