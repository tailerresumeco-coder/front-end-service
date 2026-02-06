import axios from 'axios';

const BASE_PATH = 'https://api.tailerresume.com';
// const BASE_PATH='http://127.0.0.1:8000';

/**
 * Upload resume and JD for tailoring (uses V2 two-step processing)
 * @param {string} resume - Raw resume text
 * @param {string} jd - Job description text
 */
export const uploadResumeAndJD = (resume, jd) => {
    const payload = {
        resume: resume,
        jd: jd
    }
    // Default endpoint now uses V2 processing internally
    return axios.post(`${BASE_PATH}/resume/tailer-resume`, payload);
}

/**
 * Parse resume only (no JD required) - V2 endpoint
 * @param {string} resume - Raw resume text
 */
export const parseResumeOnly = (resume) => {
    const payload = {
        resume: resume,
        jd: null  // No JD = parse-only mode
    }
    return axios.post(`${BASE_PATH}/resume/tailer-resume-v2`, payload);
}

/**
 * Legacy single-prompt processing (for A/B testing)
 * @param {string} resume - Raw resume text
 * @param {string} jd - Job description text
 */
export const uploadResumeAndJDLegacy = (resume, jd) => {
    const payload = {
        resume: resume,
        jd: jd
    }
    return axios.post(`${BASE_PATH}/resume/tailer-resume-legacy`, payload);
}

export const downloadPdfApi = (payload) => {
  return axios.post(
    `${BASE_PATH}/resume/download-pdf`,
    payload,
    {
      responseType: "blob"
    }
  );
};

export const apikeySave=(payload)=>{
  return axios.post(`${BASE_PATH}/resume/token/save`,payload);
}

export const getKeys=()=>{
  return axios.get(`${BASE_PATH}/resume/tokens`);
}

export const activateKey=(payload)=>{
  return axios.patch(`${BASE_PATH}/resume/token/activate`,payload);
}

export const deleteKey = (id) => {
  return axios.delete(`${BASE_PATH}/resume/token/delete/${id}`);
};

export const feedback = (payload) => {
  return axios.post(`${BASE_PATH}/resume/feedback`, payload);
}