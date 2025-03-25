const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Resource', ResourceSchema);
