import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config";
import { TOKEN_EXPIRATION } from "../helpers";

const UserSchema = new mongoose.Schema({
  name: { type: String, select: true },
  email: { type: String, unique: true },
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
const User = mongoose.model("User");

export default User;
