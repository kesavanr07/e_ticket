const Tickets   = require("../model/tickets");
const common    = require('../utils/common');
const moment    = require('moment');
const _self     = {}; 

class TrainData {

    getAllTickets = async (req, callback) => {
        try {
            const all_tickets = await Tickets.find({});
            callback(null, {all_tickets});
        } catch (error) {
            callback(error);
        }
    }

    bookTicket = async (req, callback) => {

        var req_body = req.body || null;

        if(!req_body) 
            return callback("Empty request data");

        if(!req_body.train_id)
            return callback("Please select train");

        if(!req_body.user_id)
            return callback("Empty user id");
        
        if(!req_body.passengers)
            return callback("Empty From Station");
  
        const {train_id, user_id, passengers} = req_body;
        const ticket_price = passengers.map((obj, currentValue) => {
            return (parseFloat(obj.ticket_price) + parseFloat(currentValue)).toFixed(2);
        });
        try {

            const ticket_count = await Tickets.find({}).count();
            
            const book_ticket = Tickets ({
                ticket_id : (ticket_count || 0) + 1,
                train_id,
                user_id,
                passengers,
                ticket_price : (ticket_price).toString(),
                booked_date : moment().format("DD/MM/YYYY")
            });

           await book_ticket.save();

            callback(null, {message : "Your Ticket booked successfully"});
        } catch (error) {
            callback(error);
        }
    }

    cancelTicket = async (req, callback) => {

        var req_body = req.body || null;

        if(!req_body) 
            return callback("Empty request data");

        if(!req_body.ticket_id)
            return callback("Empty ticket id");
  
        const {ticket_id} = req_body;
        try {

            await Tickets.findOneAndUpdate({ticket_id: ticket_id},{
                $set:{
                    cancelled_date : moment().format("DD/MM/YYYY"),
                    status : 'cancelled'
                }
            });
            callback(null, {message : "Your Ticket has been cancelled"});
        } catch (error) {
            callback(error);
        }
    }

}

module.exports = new TrainData;