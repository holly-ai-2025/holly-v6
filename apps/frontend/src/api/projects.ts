import api from "../lib/api";

export interface Project {
  id: number;
  boardId: number;
  name: string;
  notes?: string;
  deadline?: string;
  archived?: boolean;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/db/projects");
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`/db/projects/${id}`);
  return response.data;
};

export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const response = await api.patch(`/db/projects/${id}`, data);
  return response.data;
};