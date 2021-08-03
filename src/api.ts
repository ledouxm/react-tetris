import axios from "axios";

const baseURL = "http://localhost:8080/api";

export const api = axios.create({ baseURL });
