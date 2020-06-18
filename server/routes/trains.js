const express   = require('express');
const router    = express.Router();

const common    = require('../lib/utils/common');
const trains  = require('../lib/controller/trains');


router.post('/get', common.authenticateToken, function(req, res, next) {
    trains.getTrainsByUsers(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/save', common.authenticateToken, function(req, res, next) {
    trains.saveTrains(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/delete', common.authenticateToken, function(req, res, next) {
    trains.deleteTrain(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

module.exports = router;
