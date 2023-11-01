const mongoose = require("mongoose");


const usersSchema = new mongoose.Schema({
  Username: { type: String},
  Password: { type: String},
  Email: { type: String},
  access: { type: String},
  Role: { type: String},
  Address: [
    {
      addressLine: { type: String },
      city: { type: String },
      pinCode: { type: String },
      state: { type: String },
      MobileNumber: { type: Number },
    },
  ],
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
