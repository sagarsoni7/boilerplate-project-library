//All the requirements
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


//Create schema
let userSchema = new Schema ({
  title: String,
  comments: [String],
  commentcount: Number
})


//Create model
let user = mongoose.model("user", userSchema)

//Export model
exports.user = user;