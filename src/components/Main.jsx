import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { uploadResumeAndJD } from "../services/resumeService";

// ✅ CRA / Webpack worker setup (SAFE)
// import "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function Main() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [jd, setJd] = useState("");
  const [resumeContent, setResumeContent] = useState({});

  const onSend = async () => {
    try {
      const res = await uploadResumeAndJD(text, jd);
      console.log('res is ', res);
      
    } catch (err) {
      console.error(err);
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("❌ Please upload a PDF file");
      return;
    }

    setStatus("⏳ Processing PDF...");
    setText("");

    try {
      const pdf = await pdfjsLib.getDocument(
        URL.createObjectURL(file)
      ).promise;

      let extractedText = "";
      let hasText = false;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const hyperLinks = await page.getAnnotations();
        
        const hyperlinksMap = {};
        hyperLinks.forEach((hyperlink) => {
          if (hyperlinksMap.length === 0 || !hyperlinksMap[hyperlink.overlaidText]) {
            hyperlinksMap[hyperlink.overlaidText] = hyperlink.url;
          }
        });

      
        content.items.forEach((item) => {
          if (hyperlinksMap[item.str]) {
            item.str = `${item.str}HASHYPERLINK${hyperlinksMap[item.str]}`;
          }
        });

        if (content.items.length > 0) {
          hasText = true;
        }

        content.items.forEach((item) => {
          extractedText += item.str + " ";
        });
      }

      if (!hasText) {
        setStatus("⚠️ Scanned PDF detected. Send to OCR (FastAPI).");
        // TODO: send PDF to FastAPI OCR endpoint
        return;
      }

      setText(extractedText.trim());
      setStatus("✅ Text extracted successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to process PDF");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        style={{
          border: "1px solid #ccc",
        }}
        placeholder="AKHIL plz Paste your JD here"
      />

      <button
        onClick={onSend}
      >
        Send
      </button>

      <p style={{ marginTop: "10px" }}>{status}</p>

      {text && (
        <textarea
          value={text}
          readOnly
          rows={15}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
          }}
        />
      )}
    </div>
  );
}
