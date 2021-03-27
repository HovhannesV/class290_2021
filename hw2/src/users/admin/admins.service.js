const User = require('./../user.entity');

class AdminsService {
    unlockUser(id) {
        return User.update({ _id : id }, { $set : { successiveFailuresCount : 0  } }).exec();
    }
}

module.exports = new AdminsService();