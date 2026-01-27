import axios from 'axios';

const BASE_PATH = 'https://api.tailerresume.com';
// const BASE_PATH='http://127.0.0.1:8000';

export const uploadResumeAndJD = (resume, jd) => {
    const payload = {
        resume: resume,
        jd: jd
    }
    return axios.post(`${BASE_PATH}/resume/tailer-resume`, payload);
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