const express   = require('express');
const router    = express.Router();

const common    = require('../lib/utils/common');
const ticket  = require('../lib/controller/tickets');


router.post('/get', common.authenticateToken, function(req, res, next) {
    ticket.getAllTickets(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/save', common.authenticateToken, function(req, res, next) {
    ticket.bookTicket(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/cancel', common.authenticateToken, function(req, res, next) {
    ticket.cancelTicket(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});



module.exports = router;
