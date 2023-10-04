const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    doctorId: { type: String, required: false },

    amount: { type: Number, required: true },
    openAppointment: { type: Boolean, required: false, default: false },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["success", "declined", "UNPAID"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("PaymentModel", paymentSchema);
