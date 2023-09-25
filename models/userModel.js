const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    activationToken: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isUser: {
      type: Boolean,
      default: true,
    },
    isGroomer: {
      type: Boolean,
      default: false,
    },
    isNurse: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unseenNotifications: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "pending",
    },
    otp: String,
    otpExpires: Date,
    isActivated: {
      type: Boolean,
      default: false, // The user is initially not activated
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
