import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      //Mongoose String 和 Number 类型有一个 enum 验证器。enum 验证器是一个数组，它将检查给定的值是否是数组中的项。
      //如果该值不在数组中，当您尝试 save() 时，Mongoose 将抛出 ValidationError。
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my city",
      required: true,
    },
    createdBy: {
      //ObjectId 是 MongoDB 中的一个数据类型，用于表示一个文档（Document）在数据库中的唯一标识
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  //timestamps: true 会自动添加 createdAt 和 updatedAt 字段
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
