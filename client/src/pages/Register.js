import React, { useState } from "react";
import Wrapper from "../assets/wrappers/RegisterPage";
import { Logo, FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

function Register() {
  const [values, setValues] = useState(initialState);

  //使用useAppContext钩子，获取全局状态
  // const state = useAppContext();
  // console.log(state);
  const navigate = useNavigate();
  //从全局状态中获取user,isLoading,showAlert,displayAlert,registerUser
  const {
    user,
    isLoading,
    showAlert,
    displayAlert,
    setupUser,
  } = useAppContext();

  //useEffect钩子，监听user状态，如果user状态发生变化，跳转到首页
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        console.log("+++");
        navigate("/");
      }, 500);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    // console.log(e.target.name);
    //动态更新状态中的值，e.target.name对应form表单中每一项
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    //阻止表单提交避免刷新网页
    e.preventDefault();
    //检查空项
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    //如果是注册用户，调用registerUser方法
    const currentUser = { name, email, password };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "User Logged In! Redirecting...",
      });
    } else {
      //如果不是注册用户，调用registerUser方法,registerUser方法在appContext中
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created! Redirecting...",
      });
    }
  };

  // 切换注册登录
  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {/* 如果不是已经注册的用户，则显示输入框 */}
        {/* name input */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* email input */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register;
