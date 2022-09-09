const router = require('express').Router();
const { getPermissions } = require('../utils/utils');
const blacklist = require('../models/blacklist')

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is logged in.");
        console.log(req.user);
        next();
    }
    else {
        console.log("User is not logged in.");
        res.redirect('/');
    }
}

router.get('/', isAuthorized, (req, res) => {

    const { guilds } = req.user;
    const guildMemberPermissions = new Map();
    guilds.forEach(guild => {
        const perm = getPermissions(guild.permissions);
        guildMemberPermissions.set(guild.id, perm);
    });


blacklist.find({}, function(err, bl){
    res.render('blacklist', {
        username: req.user.username,
        discordId: req.user.discordId,
        avatar: `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png`,
        permissions: guildMemberPermissions,
        blList: bl

    });
});});

router.get('/settings', isAuthorized, (req, res) => {
    res.send(200);
});

module.exports = router;