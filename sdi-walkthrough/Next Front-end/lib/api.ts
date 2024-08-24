import axios from "axios";
import {
  Walkthrough,
  Walkthroughs,
  createWalkthroughResponse,
  Area,
  DataPoint,
  type Department,
  Log,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

export async function getDepartmentData() {
  // console.log("Fetching departments.");
  const response = await api.get<Department[]>(`departments`);
  // console.log("received data:", response.data);
  // console.log("Finished fetching departments data.");
  return response;
}

// Walkthrough CRUD
// Create
export async function createWalkthrough(name: string, department: string) {
  // if (!name || !department || name === "Select a Walkthrough") {
  //   return null;
  // }
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

// Read All
export async function getWalkthroughs(department: string) {
  // console.log("Fetching walkthroughs.");
  // if (!department) {
  //   return null;
  // }
  const response = await api.get<Walkthroughs>(`walkthrough`, {
    params: {
      department: department,
    },
  });
  return response;
}

// Read One
export async function getWalkthrough(id: string) {
  // if (!name || name === "Select a Walkthrough") {
  //   return null;
  // }
  const response = await api.get<Walkthrough>(`walkthrough/${id}`);
  // console.log(response.data);
  return response;
}

// Update
export async function updateWalkthrough(id: string, name?: string, periodicity?: string, weekly?: string, perSwing?: string) {
  const payload: any = {};

  if (name !== undefined) payload.name = name;
  if (periodicity !== undefined) payload.periodicity = periodicity;
  if (weekly !== undefined) payload.weekly = weekly;
  if (perSwing !== undefined) payload.perSwing = perSwing;
  const response = await api.patch(
    `walkthrough/${id}`,
    payload,
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteWalkthrough(id: string) {
  // console.log('Now deleting walkthrough:', name)
  // if (!name || name === "Select a Walkthrough") {
  //   return null;
  // }
  const response = await api.delete(`walkthrough/${id}`, {
    withCredentials: true,
  });
  return response;
}

// Area CRUD
// Create
export async function createArea(areaPackage: Area) {
  const response = await api.post<Area>(`area`, areaPackage, {
    withCredentials: true,
  });
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
export async function updateArea(areaPackage: Area) {
  const response = await api.patch<Area>(
    `area/${areaPackage._id}`,
    areaPackage,
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteArea(areaId: string) {
  const response = await api.delete(`area/${areaId}`, {
    withCredentials: true,
  });
  return response;
}

// DataPoint CRUD
// Create
export async function createDataPoint(dataPoint: DataPoint) {
  const response = await api.post<DataPoint>(`datapoint`, dataPoint, {
    withCredentials: true,
  });
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
export async function updateDataPoint(dataPoint: DataPoint) {
  const response = await api.patch<DataPoint>(
    `datapoint/${dataPoint._id}`,
    dataPoint,
    {
      withCredentials: true,
    }
  );
  return response;
}

// Delete
export async function deleteDataPoint(dataPointId: string) {
  const response = await api.delete(`datapoint/${dataPointId}`, {
    withCredentials: true,
  });
  return response;
}

// Log CRUD
// Create
export async function createLog(
  data: Log
) {
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

export default api;
