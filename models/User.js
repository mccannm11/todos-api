const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("../config.js");
const { TOKEN_EXPIRATION } = require("../helpers.js");

const UserSchema = new mongoose.Schema({
  name: { type: String, select: true },
  email: { type: String, index: { unique: true } },
  password: { type: String, select: false },
  todos: [
    {
      title: { type: String, default: "" },
      completed: { type: Boolean, default: false }
    }
  ]
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      id: this._id,
      expiredIn: TOKEN_EXPIRATION
    },
    config.secret
  );
};

UserSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hashSync(password);
};

mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
