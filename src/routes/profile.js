const router = require('express').Router();
const { getPermissions } = require('../utils/utils');
const vwarns = require('../models/vwarns')

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

var test = vwarns.find({userId: req.user.discordId}).count()
if(test === 0){
        res.render('profile', {
            username: req.user.username,
            discordId: req.user.discordId,
            email: req.user.email,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png`,
            permissions: guildMemberPermissions,
        });
}else{
    vwarns.find({userId: req.user.discordId}, function(err, vw){
        res.render('profile', {
            username: req.user.username,
            discordId: req.user.discordId,
            email: req.user.email,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png`,
            permissions: guildMemberPermissions,
            vwList: vw
            
    
        });
    });
}



});

router.get('/settings', isAuthorized, (req, res) => {
    res.send(200);
});

module.exports = router;