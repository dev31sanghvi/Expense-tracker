import { useState } from "react";

const FileUpload = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", width: "300px" }}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {fileName && <p>Uploaded: {fileName}</p>}
    </div>
  );
};

export default FileUpload;
