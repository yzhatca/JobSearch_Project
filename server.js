import "express-async-errors";
import morgan from "morgan";
import express from "express";

const app = express();

// db and authenticateUser
import connectDB from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

//将环境变量中的变量从 .env 文件加载到 process.env中,类似端口号,token密匙等
import dotenv from "dotenv";
dotenv.config();

//morgan是一个HTTP请求记录器中间件，用于在控制台中显示应用程序的请求日志。它的作用是在服务器端记录客户端的请求信息，
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
/*Express应用程序使用中间件来解析请求正文中的JSON数据。具体来说，express.json()是Express框架内置的中间件函数之一，
它可以将请求正文中的JSON数据解析为JavaScript对象，并将其存储在req.body属性中，方便后续在应用程序中使用。使用这个中间件
的好处是，当客户端使用POST、PUT、PATCH等方法向服务器发送JSON数据时，我们可以方便地获取到这些数据，而不需要手动解析JSON
字符串。*/
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome!" });
});

app.get("/api/v1", (req, res) => {
  res.json({ msg: "API!" });
});

//手动设置跨域访问
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

//mongodb异步调用,返回的是Promise对象
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
