const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    urls: [{
        type: Schema.Types.ObjectId,
        ref: 'Traffic'
    }]
});


module.exports = mongoose.model('User', userSchema);