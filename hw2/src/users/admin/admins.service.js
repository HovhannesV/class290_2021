const User = require('./../user.entity');

class AdminsService {
    unlockUser(id) {
        return User.update({ _id : id }, { $set : { successiveFailuresCount : 0,  lockedByAdmin : false } }).exec();
    }
    lockUser(id) {
        return User.update({ _id : id }, { $set : { lockedByAdmin : true } }).exec();
    }
}

module.exports = new AdminsService();