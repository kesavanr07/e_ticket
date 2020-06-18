const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrainsSchema = new Schema({
    train_id: {
        type: Number,
        unique: true,
        required: true,
        default: 0
    },
    train_name: {
        type: String,
        required: true
    },
    train_number: {
        type: Number, 
        required: true
    },
    from_station: {
        type: String,
        required: true
    },
    to_station: {
        type: String,
        required: true
    },
    ticket_price: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('trains', TrainsSchema);
