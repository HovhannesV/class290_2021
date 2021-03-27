const express = require('express');
const {Unauthorized} = require('http-errors');
const router = express.Router();
const adminsService = require('./admins.service');
const asyncHandler = require('express-async-handler');
const {USER_ROLES} = require('../../commons/util');

router.patch('/unlock-user/:id', asyncHandler(async (req, res) => {
    if(req.user.role !== USER_ROLES.ADMIN) throw new Unauthorized('Not authorized!');

    const { id } = req.params;
    await adminsService.unlockUser(id);

    res.send({
        message : 'User has successfully been unlocked!'
    })

}));

module.exports = router;