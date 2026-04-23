import axios from 'axios';

const MEU_IP = "192.168.1.102";

const api = axios.create({
  baseURL: `http://${MEU_IP}:8082/api`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;