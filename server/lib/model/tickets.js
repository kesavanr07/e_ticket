const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketsSchema = new Schema({
    ticket_id: {
        type: Number,
        unique: true,
        required: true,
        default: 0
    },
    train_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: Number, 
        required: true
    },
    passengers: {
        type: Array,
        required: true
    },
    booked_date: {
        type: String,
        required: true
    },
    ticket_price: {
        type: String,
        required: true
    },
    cancelled_date : {
        type: String,
        default : ""
    },
    status : {
        type:String,
        default : "booked"
    }
});

module.exports = mongoose.model('tickets', TicketsSchema);
