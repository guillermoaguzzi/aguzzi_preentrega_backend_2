const mongoose = require("mongoose");

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
  },
  purchasedBy: {
    type: String,
    required: true
  }
});

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
module.exports = ticketsModel;