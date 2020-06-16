const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const trafficSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    perUser: {
        type: Number,
        required: true
    },
    perMillion: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Traffic', trafficSchema);