import axios from "axios";
import APIConfig from '@/apis/config/apiconfig.js';

export default axios.create({
  baseURL: APIConfig,
  header: {
    "Content-Type": "multipart/form-data",
  },
});