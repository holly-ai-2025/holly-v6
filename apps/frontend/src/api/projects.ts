import api from "../lib/api";

export interface Project {
  id: number;
  boardId: number;
  name: string;
  notes?: string;
  deadline?: string;
  archived?: boolean;
}

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/db/projects");
  return response.data;
};

// Get a single project by ID
export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`/db/projects/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const response = await api.post("/db/projects", data);
  return response.data;
};

// Update an existing project
export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const response = await api.patch(`/db/projects/${id}`, data);
  return response.data;
};