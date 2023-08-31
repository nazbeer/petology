const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the Patient model
    required: true,
  },
  // document: {
  //   path: {
  //     type: String,
  //     required: true,
  //   },
  //   originalName: {
  //     type: String,
  //     required: true,
  //   },
  //   extension: {
  //     type: String,
  //     required: true,
  //   }
  // },
  documentPath:{
    type:String,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HistoryModel = mongoose.model("History", historySchema);

module.exports = HistoryModel;
