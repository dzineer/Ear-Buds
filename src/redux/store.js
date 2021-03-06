import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { getNewToken, getMyData, loginHelper } from "../spotifyLogin";
import { getDevices } from "../api/spotifyApi";

const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
const SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN";
const SET_SPOTIFY_CODE = "SET_SPOTIFY_CODE";
const SET_USER_DATA = "SET_USER_DATA";
const SET_ROOM_CODE = "SET_ROOM_CODE";
const SET_DEVICE_ID = "SET_DEVICE_ID";
const SET_POSITION = "SET_POSITION";

export const setAccessToken = (access_token) => {
  return {
    type: SET_ACCESS_TOKEN,
    access_token,
  };
};

export const setRefreshToken = (refresh_token) => {
  return {
    type: SET_REFRESH_TOKEN,
    refresh_token,
  };
};

export const setUserData = (userData) => {
  return {
    type: SET_USER_DATA,
    userData,
  };
};

export const setSpotifyCode = (code) => {
  return {
    type: SET_SPOTIFY_CODE,
    code,
  };
};

export const setDeviceId = (code) => {
  return {
    type: SET_DEVICE_ID,
    code,
  };
};

export const setPosition = (position) => {
  return {
    type: SET_POSITION,
    position,
  };
};

export const setRoomCode = (roomCode) => {
  return {
    type: SET_ROOM_CODE,
    roomCode,
  };
};

export const getAccessToken = (code) => {
  return async (dispatch) => {
    try {
      const res = await loginHelper(code);
      dispatch(setAccessToken(res.access_token));
      dispatch(setRefreshToken(res.refresh_token));
    } catch (err) {
      console.error(err);
    }
  };
};

export const getNewAccessToken = (refreshToken) => {
  return async (dispatch) => {
    try {
      const newToken = await getNewToken(refreshToken);
      dispatch(setAccessToken(newToken));
    } catch (err) {
      console.error(err);
    }
  };
};

export const getUserData = (token) => {
  return async (dispatch) => {
    try {
      let userData;
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err))
        .then((data) => {
          userData = data;
          getDevices(token);
        })
        .then((devices) => {
          userData.devices = devices;
          dispatch(setUserData(userData));
        });
    } catch (err) {
      console.error(err);
    }
  };
};

const initialState = {
  access_token: "",
  refresh_token: "",
  code: "",
  userData: {},
  roomCode: "",
  deviceId: "",
  position: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return { ...state, access_token: action.access_token };
    case SET_REFRESH_TOKEN:
      return { ...state, refresh_token: action.refresh_token };
    case SET_SPOTIFY_CODE:
      return { ...state, code: action.code };
    case SET_DEVICE_ID:
      return { ...state, deviceId: action.code };
    case SET_USER_DATA:
      return { ...state, userData: action.userData };
    case SET_ROOM_CODE:
      return { ...state, roomCode: action.roomCode };
    case SET_POSITION:
      return { ...state, position: action.position };
    default:
      return state;
  }
};

const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
);

const store = createStore(reducer, middleware);

export default store;
