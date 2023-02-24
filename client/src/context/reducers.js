import { DISPLAY_ALERT, CLEAR_ALERT } from "./actions";

//reducer作用：初始化，加工数据
//需要获得两个参数，第一个是之前的状态，第二个是需要做的action
const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please provide all values!",
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }

  throw new Error(`no such action :${action.type}`);
};
export default reducer;
