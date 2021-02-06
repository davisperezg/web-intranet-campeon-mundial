import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import {
  getToken,
  getRefreshToken,
  setRefreshToken,
  setToken,
} from "./components/Helpers/AuthToken";
import App from "./App";
//axios.defaults.baseURL = "http://localhost:3000/";
import * as userService from "./components/Users/UserService";

const API = process.env.REACT_APP_API || "http://localhost:5000";

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === `${API}/v1/auth/token`
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const username = localStorage.getItem("username");
        const refreshToken = getRefreshToken();
        const resToken: any = await userService.postRefresh(
          username,
          refreshToken
        );
        if (resToken.status === 200) {
          setToken(resToken.data.token);
          const token = getToken();
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        }
      } catch (e) {
        //console.log("test");
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
