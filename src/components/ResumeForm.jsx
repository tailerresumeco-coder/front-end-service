import React from "react";
import { useResume } from "../context/ResumeContext";
import DynamicForm from "./DynamicForm";
import updateByPath from "../utils/updateByPath";
import { useNavigate } from "react-router-dom";

export default function ResumeForm() {
  const { resume, setResume } = useResume();
  const navigate = useNavigate();

  const handleChange = (path, value) => {
    const updated = updateByPath(resume, path, value);
    setResume(updated);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Edit Resume</h1>
        <button
          onClick={() => navigate("/preview")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Preview Resume
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <DynamicForm data={resume} onChange={handleChange} />
      </div>
    </div>
  );
}
