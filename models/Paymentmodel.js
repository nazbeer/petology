const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    appointmentId: { type: String, required: true },

    amount: { type: Number, required: true },

    status: { type: String, enum: ["success", "declined", "UNPAID"], required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("PaymentModel", paymentSchema);
