const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./tasks");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password Not Valid");
        }
      }
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Not Valid");
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);
/////////Hide Password And tokens
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

/////////GenerateToken USER
UserSchema.methods.GenerateToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

/////////findCridential USER
UserSchema.statics.findCridential = async function (email, password) {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("This Email Not register Try Again !");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("This password Not register Try Again !");
  }
  return user;
};
////////////HASH PASSWORD WITH BCRYPTJS
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
////////////Remove All Tasks Before Remove
UserSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ owner: user._id });
  next();
});
const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
