const router = require('express').Router();
const { getPermissions } = require('../utils/utils');
const ticket = require('../models/ticket');
const ticketMessages = require('../models/ticketMessages');
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

    if(req.user.discordId === '251698679059054593'){
        ticket.find({}, function(err, t){ //LISTE DES TICKETS (partie gauche)
             ticketMessages.find({idticket: '40108733'},  function(err, tm){//LISTE DES MESSAGES (partie droite)
            res.render('ticket', {
                username: req.user.username,
                discordId: req.user.discordId,
                avatar: `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png`,
                ticketavatar: `https://cdn.discordapp.com/avatars/${ticket.userId}/${ticket.avatar}.png`,
                permissions: guildMemberPermissions,
                tickets: t,
                ticketmessages: tm
            });
            
        });
    });
    }else{
        ticket.find({pris: req.user.discordId}, function(err, t){//LISTE DES TICKETS (partie gauche)
            ticketMessages.find({}, function(err, tm){//LISTE DES MESSAGES (partie droite)
            res.render('ticket', {
                username: req.user.username,
                discordId: req.user.discordId,
                avatar: `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png`,
                ticketavatar: `https://cdn.discordapp.com/avatars/${ticket.userId}/${ticket.avatar}.png`,
                permissions: guildMemberPermissions,
                tickets: t,
                ticketmessages: tm
        
        
            });
            
        });
    });
    }


});

router.get('/settings', isAuthorized, (req, res) => {
    res.send(200);
});

module.exports = router;