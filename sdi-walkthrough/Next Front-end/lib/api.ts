import axios from "axios";
import {
  Walkthrough,
  Walkthroughs,
  createWalkthroughResponse,
  type Department,
} from "@/types";
// import { useAuth } from "@clerk/nextjs";

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

export async function getWalkthroughs(department: string) {
  // console.log("Fetching walkthroughs.");
  const response = await api.get<Walkthroughs>(`walkthrough`, {
    params: {
      department: department,
    },
  });
  return response;
}

export async function createWalkthrough(name: string, department: string) {
  const response = await api.post<createWalkthroughResponse>(
    `walkthrough`,
    {
      name: name,
      department: department,
    },
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function getWalkthrough(name: string) {
  const response = await api.get<Walkthrough>(`walkthrough/${name}`);
  // console.log(response.data)
  return response;
}

export async function deleteWalkthrough(name: string) {
  // console.log('Now deleting walkthrough:', name)
  const response = await api.delete(`walkthrough/${name}`, {
    withCredentials: true,
  });
  return response;
}

export default api;
