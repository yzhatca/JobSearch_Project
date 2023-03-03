import { StatusCodes } from "http-status-codes";
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("errors", err.message);

  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    //如果错误对象中有msg属性，就使用错误对象的msg属性，否则使用默认的错误消息
    msg: err.message || "something went wrong, try again later",
  };
  //错误名称如果是验证错误，设置错误状态码为400(BAD_REQUEST)
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // defaultError.msg = err.message;
    //遍历错误对象的errors属性，取出错误消息
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  //如果错误名称是MongoError，设置错误状态码为400(BAD_REQUEST)
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    //Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组,返回数组中的属性名
    defaultError.msg = `Duplicate field value entered: ${Object.keys(
      err.keyValue
    )} already exists.`;
  }
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
