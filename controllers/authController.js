import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";


const register = async (req, res) => {
  //安装express-async-errors'包后，可以不用try catch
  // try {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  //创建用户写入数据库
  const user = await User.create({ name, email, password });
  // 生成token
  const token = user.createJWT();
  //安装StatusCodes包后，可以不用数字
  //返回用户数据到前端
  res.status(StatusCodes.CREATED).json({
    // 指定要返回的用户数据，不返回密码
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
  // } catch (error) {
  //   //错误来自于mongoose
  //   //调用next函数并将错误对象传递给它。这将导致Express将控制权传递给下一个错误处理中间件,并将错误对象传递给它。
  //   //next是一个函数，是Express框架提供的用于控制中间件和路由处理程序流程的方法。在Express中，请求处理流程是通过中间件
  //   //和路由处理程序来完成的，请求将在这些函数之间流动。next函数的作用是将请求的控制权传递给下一个中间件或路由处理程序，
  //   //以便继续请求的处理。
  //   next(error);
  // }
};
const login = async (req, res) => {
  //获取用户输入的email和password
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  //设置select("+password")，+password表示查询数据库时，密码字段会被返回
  const user = await User.findOne({email}).select("+password");
  if(!user){
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if(!isPasswordCorrect){
    throw new UnauthenticatedError("Invalid credentials");
  }
  const token = user.createJWT();
  //设置user.password = undefined，不返回密码
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token,location:user.location });
};
const updateUser = (req, res) => {
  res.send("updateUser");
};

export { register, login, updateUser };
