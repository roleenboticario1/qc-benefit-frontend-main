import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_REPORT,
  headers: {
    "Content-type": "application/json"
  }
});