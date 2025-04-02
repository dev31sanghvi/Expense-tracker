import { useState } from "react";
import Papa from "papaparse";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
//TODO : worker path => need to find an alternative better option for this .

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileUpload = ({ onDataParsed }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "text/csv") {
      parseCSV(file);
    } else if (file.type === "application/pdf") {
      parsePDF(file);
    } else {
      alert("Please upload a CSV or PDF file.");
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = ({ target }) => {
      Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          onDataParsed(result.data);
        },
      });
    };
  };

  const parsePDF = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async ({ target }) => {
      const pdf = await pdfjsLib.getDocument({ data: target.result }).promise;
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }

      // Convert extracted text into structured transactions
      const transactions = extractTransactionsFromPDF(extractedText);
      onDataParsed(transactions);
    };
  };

  const extractTransactionsFromPDF = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    //transaction pattern: Date, Description, Amt
    const transactions = lines.map((line) => {
      const parts = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.*?)\s+(-?\d+(\.\d{2})?)/);
      if (parts) {
        return {
          Date: parts[1],
          Description: parts[2],
          Amount: parts[3],
        };
      }
      return null;
    });

    return transactions.filter((tx) => tx); // Remove null values
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", width: "300px" }}>
      <input type="file" accept=".csv, .pdf" onChange={handleFileChange} />
      {fileName && <p>Uploaded: {fileName}</p>}
    </div>
  );
};

export default FileUpload;
