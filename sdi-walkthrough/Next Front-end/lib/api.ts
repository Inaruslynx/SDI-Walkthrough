import axios, { AxiosResponse } from "axios";
import { Walkthrough, Walkthroughs, type Department } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

export async function getDepartmentData() {
  // console.log("Fetching departments.");
  const response = await api.get<Department[]>(`departments`);
  // console.log("recieved data:", response.data);
  // console.log("Finished fetching departments data.");
  return response;
}

export async function getWalkthroughs(
  department: string) {
  // console.log("Fetching walkthroughs.");
    const response = await api.get<Walkthroughs>(`walkthrough`, {
      params: {
        department: department
      }
    })
  return response;
}
  
export async function createWalkthrough(name: string, department: string) {
  const response = await api.post<Walkthroughs>(`walkthrough`, {
    name: name,
    department: department
  })
  return response;
}

export async function getWalkthrough(name: string) {
  const response = await api.get<Walkthrough>(`walkthrough`, {
    params: {
      name: name
    }
  })
  return response;
}

export default api;
