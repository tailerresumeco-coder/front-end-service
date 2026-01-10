import axios from 'axios';

const BASE_PATH = 'https://back-end-service-vvxg.onrender.com';

// const BASE_PATH='http://localhost:8000';

export const uploadResumeAndJD = (resume, jd) => {
    const payload = {
        resume: resume,
        jd: jd
    }
    return axios.post(`${BASE_PATH}/resume/tailer-resume`, payload);
}

export const keepaLive = () => {
    return axios.get(`${BASE_PATH}/resume/keepalive`);
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
