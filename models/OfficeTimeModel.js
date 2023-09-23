const mongoose = require("mongoose");

const officeTimeSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    starttime: { type: String, required: true },
    endtime: { type: String, required: true },
    break: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const officetime = mongoose.model("OfficeTime", officeTimeSchema);

module.exports = officetime;
