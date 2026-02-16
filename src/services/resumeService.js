import axios from 'axios';

const BASE_PATH = 'https://api.tailerresume.com';
// const BASE_PATH='http://127.0.0.1:8000';

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

export const storeInputResume = (payload) => {
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem('inputResume', reader.result);
  }
  reader.readAsDataURL(payload);
}

export const getInputResume = () => {
  return (localStorage.getItem('inputResume'));
}

export const storeResumes = (payload) => {
  return axios.post(`${BASE_PATH}/resume/store-resumes`, payload);
}

export const checkATSScore = (resume, jd, options = {}) => {
    const payload = {
        resume: resume,
        jd: jd
    }
    return axios.post(`${BASE_PATH}/resume/check-ats-score`, payload, options);
}
