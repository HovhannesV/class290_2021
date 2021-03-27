const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {USER_ROLES} = require('../commons/util');
const { BadRequest } = require('http-errors')

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    successiveFailuresCount : {
        type : Number,
        default : 0
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum : [ USER_ROLES.ADMIN, USER_ROLES.CUSTOMER ],
        default : USER_ROLES.CUSTOMER
    }
}, { collection: 'users' });

schema.pre('save', function (next) {
    if (this.isModified('username') && this.username.length < 4) {
        next(new BadRequest('Username should contain at least 4 chars'));
    }
    if(this.isModified('firstName')) {
        this.firstName = this.firstName.trim();
    }
    if(this.isModified('lastName')) {
        this.lastName = this.lastName.trim();
    }
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    next();
})

module.exports = mongoose.model('User', schema);