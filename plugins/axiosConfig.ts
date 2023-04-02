import Axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const axiosClient = Axios.create({
  baseURL: publicRuntimeConfig.apiUrl,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

export default axiosClient;
