import axios, { AxiosResponse } from "axios";
import type { Department } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

export async function getDepartmentData() {
  // console.log("Fetching departments.");
  const response = await api.get<Department[]>(`departments`);
  // console.log("recieved data:", response.data);
  // console.log("Finished fetching departments data.");
  return response.data;
}

export default api;
