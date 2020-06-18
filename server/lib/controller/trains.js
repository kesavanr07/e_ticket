const Trains     = require("../model/trains");
const common    = require('../utils/common');
const _self     = {}; 

class TrainData {

    getTrainsByUsers = async (req, callback) => {
        try {
            const train_data = await Trains.find({});
            console.log('train_data :>> ', train_data);
            callback(null, {train_data});
        } catch (error) {
            callback(error);
        }
    }

    saveTrains = async (req, callback) => {

        var req_body = req.body || null;

        if(!req_body) 
            return callback("Empty request data");

        if(!req_body.train_name)
            return callback("Empty Train name");

        if(!req_body.train_number)
            return callback("Empty to Train Number");
        
        if(!req_body.from_station)
            return callback("Empty From Station");
  
        if(!req_body.to_station)
            return callback("Empty To Station");
  
        if(!req_body.ticket_price)
            return callback("Empty Ticket Price");

        try {
            const train_details = {
                train_name : req_body.train_name,
                train_number : req_body.train_number,
                from_station : req_body.from_station,
                to_station : req_body.to_station,
                ticket_price : req_body.ticket_price,
            }
            if(req_body.train_id != 0) {
            
                await Trains.findOneAndUpdate({train_id: req_body.train_id},{
                    $set: train_details
                });
    
            } else {
                const train_count = await Trains.find({}).count();
            
                train_details.train_id = (train_count || 0) + 1;

                const new_train_data = Trains(train_details);
    
                await new_train_data.save();

            }

            callback(null, {message : "Train details saved successfully"});
        } catch (error) {
            callback(error);
        }
    }
    deleteTrain = async (req, callback) => {
        var req_body = req.body || null;

        if(!req_body) 
            return callback("Empty request data");

        if(!req_body._id)
            return callback("Empty id to delete");

        try {
            await Trains.remove({_id: req_body._id})
            callback(null, {message : "Deleted Train successfully"});
        } catch (error) {
            callback(error);
        }
    }
}

module.exports = new TrainData;