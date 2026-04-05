import axios from 'axios';

// Vite injects VITE_API_BASE_URL from .env.development (local) or .env.production (prod)
const BASE_PATH = import.meta.env.VITE_API_BASE_URL || 'https://api.tailerresume.com';

export const getJobs = (page = 1, size = 20, filters = {}) => {
  const { search, source, jobType } = filters;
  return axios.get(`${BASE_PATH}/jobs`, {
    params: {
      page,
      size,
      ...(search   && { search }),
      ...(source   && { source }),
      ...(jobType  && { job_type: jobType }),
    },
  });
};

export const getJobById = (id) => {
  return axios.get(`${BASE_PATH}/jobs/${id}`);
};
