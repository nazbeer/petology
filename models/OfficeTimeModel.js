const mongoose = require("mongoose");

const officeTimeSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    starttime1: { type: String, required: true },
    endtime1: { type: String, required: true },
    starttime2: { type: String, required: true },
    endtime2: { type: String, required: true },
    break: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const officetime = mongoose.model("OfficeTime", officeTimeSchema);

module.exports = officetime;
