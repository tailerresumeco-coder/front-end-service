import axios from 'axios';
import API from '../api/axios';

const BASE_PATH = 'https://api.tailerresume.com';
// const BASE_PATH = 'http://127.0.0.1:8000';

export const signup = (payload) => {
  return API.post(`${BASE_PATH}/auth/sign-up`, payload);
}

export const login = (payload) => {
  return axios.post(`${BASE_PATH}/auth/login`, payload);
}

export const OAuthGoogleSignup = (payload) => {
  return axios.post(`${BASE_PATH}/auth/oauth/google-signup`, payload);
}

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

export const uploadResumeAndJDLegacy = (
  resume,
  jd,
  resumeId = '',
  resumeName,
  config = {}
) => {
  const payload = {
    resume: resume,
    jd: jd,
    resume_id: resumeId,
    email: localStorage.getItem('email'),
    resume_name: resumeName
  }

  return API.post(
    `${BASE_PATH}/resume/tailer-resume-legacy`,
    payload,
    config   // ✅ pass signal here
  );
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

export const apikeySave = (payload) => {
  return axios.post(`${BASE_PATH}/resume/token/save`, payload);
}

export const getKeys = () => {
  return axios.get(`${BASE_PATH}/resume/tokens`);
}

export const activateKey = (payload) => {
  return axios.patch(`${BASE_PATH}/resume/token/activate`, payload);
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

// ── User resume management ─────────────────────────────────────────────────

export const getActiveResume = () => {
  return API.get(`${BASE_PATH}/resume/my-resumes/active`);
};

export const listMyResumes = () => {
  return API.get(`${BASE_PATH}/resume/my-resumes`);
};

export const uploadMyResume = (file, name) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  return API.post(`${BASE_PATH}/resume/my-resumes/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const activateMyResume = (resumeId) => {
  return API.patch(`${BASE_PATH}/resume/my-resumes/${resumeId}/activate`);
};

export const deleteMyResume = (resumeId) => {
  return API.delete(`${BASE_PATH}/resume/my-resumes/${resumeId}`);
};

export const tailorFromJob = (jobId) => {
  return API.post(`${BASE_PATH}/resume/tailor-from-job/${jobId}`);
};

// ──────────────────────────────────────────────────────────────────────────

export const checkATSScore = (resume, jd, options = {}) => {
  const payload = {
    resume: resume,
    jd: jd
  }
  return axios.post(`${BASE_PATH}/resume/check-ats-score`, payload, options);
}

export const getUsers = (page = 1, size = 10, search) => {
  return axios.get(`${BASE_PATH}/mails/get-user-details`, {
    params: {
      page
      , size
      , search
    }
  });
}

export const sendMail = (recipients, subject, body, attachment = null) => {
  const formData = new FormData();
  formData.append('recipients', JSON.stringify(recipients));
  formData.append('subject', subject);
  formData.append('body', body);

  if (attachment) {
    formData.append('attachment', attachment);
  }

  return axios.post(`${BASE_PATH}/mails/send`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const myResumesLists = () => {
  const email = localStorage.getItem('email');
  return API.get(`${BASE_PATH}/resume/my-resumes-lists/${email}`);
}