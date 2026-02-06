import React, { useState } from "react";
import { feedback } from '../services/resumeService.js';

const FeedbackDialog = ({ onSubmit, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [unLiked, setUnLiked] = useState(false)
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        liked: liked,
        unLiked: unLiked,
        message: message
    }
    await feedback(payload);
    onClose();
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* Like / Unlike */}
      <div className="flex justify-center items-center gap-6">
        {/* LIKE */}
        <button
          onClick={() => {setLiked(true); setUnLiked(false)}}
          className={`transition transform duration-200 active:scale-125
            ${liked === true ? "text-green-600 scale-110" : "text-gray-400"}
          `}
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 1 6.59 7.41C6.22 7.78 6 8.3 6 8.83V19c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V10z"/>
          </svg>
        </button>

        {/* UNLIKE */}
        <button
          onClick={() => {setUnLiked(true); setLiked(false)}}
          className={`transition transform duration-200 active:scale-125
            ${unLiked ? "text-red-600 scale-110" : "text-gray-400"}
          `}
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 3h-4v12h4V3zM2 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L11 23l6.41-6.41c.37-.37.59-.89.59-1.42V5c0-1.1-.9-2-2-2H7c-.83 0-1.54.5-1.84 1.22L2.14 11.27c-.09.23-.14-.47-.14-.73V14z"/>
          </svg>
        </button>
      </div>

      {/* Feedback */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full p-2 border rounded"
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback..."
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackDialog;
