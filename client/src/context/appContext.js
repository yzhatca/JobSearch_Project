//用于存放全局状态
import React, { useReducer, useContext } from "react";
import axios from "axios";
//引入action配合Reducer使用，action作为Reducer中的dispatch的参数
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_SUCCESS,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
} from "./actions";

import reducer from "./reducers";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  showSidebar: false,
  alertText: "",
  alertType: "",
  //user用于存放用户信息，token用于存放用户的token，userLocation用于存放用户的位置信息
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || null,
  jobLocation: userLocation || null,
};
const AppContext = React.createContext();
//AppProvider用于给子组件提供所需要的全局context,AppProvider接收children作为参数，
// 被AppProvider包裹的组件都可以得到Provider中提供的内容，被包裹的组件即为children
//AppProvider需要在index.js中引入
const AppProvider = ({ children }) => {
  // useState和useReducer可以互为替代

  //   const [state, setState] = useState(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: "/api/v1/",
  });

  //interceptors 是拦截器机制，用于在请求或响应被发送或接收之前，对其进行一些预处理或者后处理
  //interceptors 对象包含两个属性：request 和 response，分别代表请求和响应的拦截器。
  //每个属性都包含两个方法：use 和 eject。其中，use 方法用于添加拦截器，eject 方法用于移除拦截器。
  // response interceptor
  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        logoutUser();
        console.log("AUTH ERROR");
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 800);
  };

  //将用户信息存入到浏览器的local storage
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    // dispatch 登录action
    dispatch({ type: SETUP_USER_BEGIN });
    // try catch 发送get请求，如果成功获取数据库中的用户信息，则登陆成功
    try {
      //这里的currentUser是从Register.js中传递过来的
      //通过axios.post()方法访问后端的api，注册用户
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );
      const { user, token, location } = data;
      //发送action到reducers.js中
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error);
      dispatch({
        type: SETUP_USER_ERROR,
        payload: {
          msg: error.response.data.msg,
        },
      });
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      //组件向后端发送patch请求，更新用户信息
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, location, token } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage({ user, location, token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const logoutUser = () => {
    removeUserFromLocalStorage();
    dispatch({
      type: LOGOUT_USER,
    });
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  return (
    // 把定义的全局状态传给子组件
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        // registerUser,
        // loginUser,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// 可以在其他组件中使用，用于方便地访问appContext中的变量
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };

/* 这段代码定义了一个React组件AppProvider，它使用了React的useState和createContext hooks来管理全局状态，
 并将全局状态通过AppContext传递给子组件。同时，这段代码还定义了一个名为useAppContext的自定义hook，
 用于在其他组件中方便地访问全局状态。首先，代码定义了一个名为initialState的常量，它包含了应用程序的初始状态。
 这个状态对象包含了四个属性：isLoading、showAlert、alertText和alertType。接着，代码使用React.createContext()方法创建了一个
 React上下文对象AppContext，它用于在应用程序中传递全局状态。然后，AppProvider组件接受children作为参数，它使用
 useState hook来创建一个state状态值，并将initialState作为初始值。这个state状态值包含了当前的全局状态，
 即isLoading、showAlert、alertText和alertType四个属性的值。在AppProvider组件的返回值中，代码使用AppContext.Provider
 组件将全局状态传递给子组件。这里使用了展开运算符{...state}来将state状态值中的所有属性作为value属性的值传递给
 AppContext.Provider组件。这样，所有使用了AppContext的子组件都可以通过useContext hook来获取全局状态值。
 
 最后，代码定义了 一个自定义hookuseAppContext，它返回了通过AppContext获取的全局状态值。这个自定义hook可以在其他组件中
 使用，用于方便地访问全局状态值，而无需通过层层传递props的方式。在其他组件中，可以通过useAppContext()来获取全局状态值，
 并对其进行读取和修改。*/

// 问：这段代码的{children}代表了什么？
// 在React中，{children}是一个特殊的prop属性，它用于传递组件的子元素。
// 在这个例子中，AppProvider组件被定义为一个高阶组件（higher-order component），它接受一个children参数作为props，并将这个参数作为其返回值中的子元素进行渲染。
// 例如，如果在应用程序中使用AppProvider组件作为父组件包裹其他子组件，那么这些子组件将作为AppProvider组件的子元素，而它们的内容将被渲染到{children}位置。
// 下面是一个示例代码，其中AppProvider组件包含了一个div元素和子元素<ChildComponent />：
// <AppProvider>
//   <div>这是AppProvider组件中的div元素</div>
//   <ChildComponent />
// </AppProvider>
// 在上面的代码中，<div>元素和<ChildComponent />都是AppProvider的子元素，它们将被渲染到{children}位置。
// 在AppProvider组件的返回值中，可以通过{children}来访问这些子元素。
