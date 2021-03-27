const User = require('../users/user.entity');
const { Unauthorized, Locked } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {MAX_SUCCESSIVE_FAILURES} = require('./../commons/util');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username }).lean();
        if(user.successiveFailuresCount === MAX_SUCCESSIVE_FAILURES || user.lockedByAdmin) {
            throw new Locked('The user is locked!');
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            // doing custom mongo update to prevent version errors
            await User.update({ username }, { $inc : { successiveFailuresCount : 1 } });
            if(user.successiveFailuresCount + 1 === MAX_SUCCESSIVE_FAILURES) {
                throw new Locked('The user is locked!');
            }
            throw new Unauthorized();
        }
        if(user.successiveFailuresCount > 0) { // reset only if needed
            await User.update({ username }, { $set : { successiveFailuresCount : 0 } });
        }
        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();