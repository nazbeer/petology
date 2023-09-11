const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  module: { type: String, required: true, unique: true },
  lastId: { type: Number, default: 0 },
});

const CounterModel = mongoose.model('Counter', counterSchema);

module.exports = CounterModel;