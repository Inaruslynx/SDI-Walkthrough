import axios, { AxiosResponse } from "axios";
import {
  type Walkthrough,
  type createWalkthroughResponse,
  type Area,
  type DataPoint,
  type Department,
  type Log,
  type User,
  type Report,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// Department CRUD

// Find all
export async function getAllDepartments() {
  // console.log("Fetching departments.");
  const response = await api.get<Department[]>(`departments`);
  // console.log("received data:", response.data);
  // console.log("Finished fetching departments data.");
  return response;
}

// Find one
export async function getOneDepartment(id?: string, name?: string) {
  let response: AxiosResponse<Department, any>;
  if (id) {
    response = await api.get<Department>(`departments/`, {
      params: id,
    });
    return response;
  }
  if (name) {
    response = await api.get<Department>(`departments/`, {
      params: name,
    });
    return response;
  }
}

// Walkthrough CRUD
// Create
export async function createWalkthrough(
  name: string,
  department: string,
  orgId: string
) {
  // if (!name || !department || name === "Select a Walkthrough") {
  //   return null;
  // }
  const response = await api.post<createWalkthroughResponse>(
    `walkthrough`,
    {
      name: name,
      department: department,
      orgId,
    },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Read All
export async function getWalkthroughs(department?: string) {
  // console.log("Fetching walkthroughs.");
  // if (!department) {
  //   return null;
  // }
  if (!department) {
    const response = await api.get<Walkthrough[]>(`walkthrough`);
    return response;
  } else {
    const response = await api.get<Walkthrough[]>(`walkthrough`, {
      params: {
        department: department,
      },
    });
    return response;
  }
}

// Read One
export async function getWalkthrough(id: string) {
  // if (!name || name === "Select a Walkthrough") {
  //   return null;
  // }
  // const response = await api.get<Walkthrough>("walkthrough", {
  //   params: {
  //     id: id,
  //   },
  // });
  const response = await api.get<Walkthrough>(`walkthrough/${id}`);
  // console.log(response.data);
  return response;
}

// Update
export async function updateWalkthrough(
  id: string,
  orgId: string,
  name?: string,
  periodicity?: string,
  weekly?: string,
  perSwing?: string
) {
  const payload: any = {};

  if (name !== undefined) payload.name = name;
  if (periodicity !== undefined) payload.periodicity = periodicity;
  if (weekly !== undefined) payload.weekly = weekly;
  if (perSwing !== undefined) payload.perSwing = perSwing;
  const response = await api.patch(
    `walkthrough/${id}`,
    { ...payload, orgId },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteWalkthrough(id: string, orgId: string) {
  // console.log('Now deleting walkthrough:', name)
  // if (!name || name === "Select a Walkthrough") {
  //   return null;
  // }
  const response = await api.delete(`walkthrough/${id}`, {
    params: { orgId },
    withCredentials: true,
  });
  return response;
}

// Area CRUD
// Create
export async function createArea(areaPackage: Area, orgId: string) {
  const response = await api.post<Area>(
    `area`,
    { ...areaPackage, orgId },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Find all
export async function findAllAreas(walkthrough: string) {
  const response = await api.get<Area[]>(`area`, {
    params: {
      walkthrough: walkthrough,
    },
  });
  return response;
}

// Find one
export async function findArea(areaId: string) {
  const response = await api.get<Area>(`area/${areaId}`);
  return response;
}

// Update
export async function updateArea(areaPackage: Area, orgId: string) {
  const response = await api.patch<Area>(
    `area/${areaPackage._id}`,
    { ...areaPackage, orgId },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteArea(areaId: string, orgId: string) {
  const response = await api.delete(`area/${areaId}`, {
    params: { orgId },
    withCredentials: true,
  });
  return response;
}

// DataPoint CRUD
// Create
export async function createDataPoint(dataPoint: DataPoint, orgId: string) {
  const response = await api.post<DataPoint>(
    `datapoint`,
    { ...dataPoint, orgId },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Find all
export async function findAllDataPoints(walkthrough: string) {
  const response = await api.get<DataPoint[]>(`datapoint`, {
    params: {
      walkthrough: walkthrough,
    },
  });
  return response;
}

// Find one
export async function findDataPoint(dataPointId: string) {
  const response = await api.get<DataPoint>(`datapoint/${dataPointId}`);
  return response;
}

// Update
export async function updateDataPoint(dataPoint: DataPoint, orgId: string) {
  const response = await api.patch<DataPoint>(
    `datapoint/${dataPoint._id}`,
    { ...dataPoint, orgId },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteDataPoint(dataPointId: string, orgId: string) {
  const response = await api.delete(`datapoint/${dataPointId}`, {
    params: { orgId },
    withCredentials: true,
  });
  return response;
}

// Log CRUD
// Create
export async function createLog(data: Log) {
  const response = await api.post<Log>(
    `log`,
    { data },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Find all
export async function findAllLogs(
  walkthrough: string,
  fromDate?: Date,
  toDate?: Date
) {
  const response = await api.get("log", {
    params: {
      walkthrough: walkthrough,
      fromDate: fromDate,
      toDate: toDate,
    },
  });
  return response;
}

// Find one
export async function findLog(id: string) {
  const response = await api.get(`log/${id}`);
  return response;
}

// Update
export async function updateLog(id: string, data: Log) {
  const response = await api.patch(
    `log/${id}`,
    { data },
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteLog(id: string) {
  const response = await api.delete(`log/${id}`, {
    withCredentials: true,
  });
  return response;
}

// User CRUD
// Create
export async function createUser(data: User) {
  const response = await api.post<User>(`user`, data, {
    withCredentials: true,
  });
  return response;
}

// Find all
export async function findAllUsers() {
  const response = await api.get<User[]>("user", {
    withCredentials: true,
  });
  return response;
}

// Find one
export async function findUser(id: string) {
  const response = await api.get<User>(`user/${id}`, {
    withCredentials: true,
  });
  return response;
}

// Update
export async function updateUser(id: string, data: User) {
  const response = await api.patch<User>(`user/${id}`, data, {
    withCredentials: true,
  });
  return response;
}

// Delete
export async function deleteUser(id: string) {
  const response = await api.delete<User>(`user/${id}`, {
    withCredentials: true,
  });
  return response;
}

// Report CRUD
// Get Report
export async function getReport(walkthrough: string) {
  const response = await api.get<Report>(`report`, {
    params: { walkthrough },
  });
  return response.data;
}

// Graph CRUD
// Get Graph
export async function getGraph(
  walkthrough: string,
  dataPoint: string,
  toDate?: string,
  fromDate?: string
) {
  const paramPackage = {
    walkthrough: walkthrough,
    dataPoint: dataPoint,
    toDate: toDate || undefined,
    fromDate: fromDate || undefined,
  };
  const response = await api.get(`graph`, {
    params: paramPackage,
  });
  return response.data;
}

export default api;
