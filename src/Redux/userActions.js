import toast from "react-hot-toast";

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export const setUser = (user, token) => {
  return {
    type: SET_USER,
    payload: { user, token },
  };
};

export const clearUser = () => ({
  type: CLEAR_USER,
});


export const logout = () => (dispatch) => {
  dispatch(clearUser());
  toast.success("Logged out successfully!");
};
