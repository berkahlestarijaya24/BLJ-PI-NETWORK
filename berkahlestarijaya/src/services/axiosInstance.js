import axios from "axios"
import { BASE_URL } from "../utils/constants"

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Will be set dynamically
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default axiosInstance
