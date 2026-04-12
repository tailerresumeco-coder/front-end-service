import axios from 'axios';

// Vite injects VITE_API_BASE_URL from .env.development (local) or .env.production (prod)
const BASE_PATH = 'https://api.tailerresume.com';
// const BASE_PATH='http://127.0.0.1:8000';

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
