import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      //need to npm install validator
      validator: validator.isEmail,
      message: "Please enter a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 6,
    //  select: false, //默认情况下，查询数据库时，密码字段会被返回。如果不想返回密码字段，可以设置select: false
    select: false,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "my city",
  },
});

// userSchema在保存之前执行的函数，只有在save()和create()方法中才会触发
userSchema.pre("save", async function () {
  //查看哪个字段被修改了
  console.log(this.modifiedPaths());
  console.log(this.isModified("password"));
  //如果密码没有被修改，就不需要再次加密
  if (!this.isModified("password")) return;
  //salt是一个随机的字符串，用于增加哈希值的复杂性，增加密码破解的难度。通过使用不同的salt，
  //即使两个用户使用了相同的密码，也会生成不同的哈希值，这增加了密码破解的难度。在代码中，
  //salt的长度为10，表示使用10个字符的随机字符串作为salt。
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// userSchema.methods是一个对象，可以在实例化的对象上调用
userSchema.methods.createJWT = function () {
  // this指向当前的user对象
  // console.log(this)
  // jwt.sign()方法用于生成token，第一个参数是payload，第二个参数是secret，第三个参数是options
  // payload一般是用户的id，secret是一个密钥，options是一个对象，可以设置token的过期时间
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
