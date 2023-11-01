const mongoose = require("mongoose")
require("dotenv").config()

module.exports=
mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
