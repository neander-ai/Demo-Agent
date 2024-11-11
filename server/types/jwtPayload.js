const { Types } = require('mongoose');

/**
 * @typedef {Object} JwtPayload
 * @property {Types.ObjectId} userId - The ID of the user
 * @property {string} emailAdd - The email address of the user
*/

module.exports = {
    JwtPayload: {
      userId: Types.ObjectId,
      emailAdd: 'string',
    }
  };
