const mongoose = require('mongoose');
const { GENDER_ENUMS } = require('../utils/constants');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    username: {
        type: String,
        required: true
      },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
        type: String,
        required: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
        type: String,
        required: true,
        enum: GENDER_ENUMS,
    }
 },
 { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);