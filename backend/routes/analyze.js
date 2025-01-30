const express = require("express");
const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");

const router = express.Router();

// POST /api/analyze
router.post("/", async (req, res) => {
  console.log("Received request at /api/analyze");
  console.log("Request body:", req.body);

  const fileName = req.body.fileName;

  if (!fileName) {
    console.log("File name is missing in the request.");
    return res.status(400).send("File name is required.");
  }

  const filePath = path.join(__dirname, "../uploads", fileName);
  console.log("File path:", filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log("File not found:", filePath);
    return res.status(404).send("File not found.");
  }

  const keywords = [];
  const highPerforming = [];
  const lowPerforming = [];

  console.log("Starting to read the CSV file...");

  // Read and parse the CSV file
  fs.createReadStream(filePath)
    .on("error", (err) => {
      console.error("Error opening file:", err);
      return res.status(500).send("Error opening file.");
    })
    .pipe(csvParser())
    .on("data", (row) => {
      console.log("Row keys:", Object.keys(row));
      console.log("Processing row:", row); // Log every row for debugging

      const cleanedRow = Object.keys(row).reduce((acc, key) => {
        const cleanedKey = key.replace(/^["'\s]+|["'\s]+$/g, '');  
        acc[cleanedKey] = row[key];
        return acc;
      }, {});
      
      console.log("Cleaned Row keys:", Object.keys(cleanedRow)); 
      
      const keyword = cleanedRow["Matched product"]; // Use the cleaned key
      const clicks = row["Clicks"];
      const CTR = row["CTR"];
      const ACOS = row["ACOS"];
      const ROAS = row["ROAS"];

      console.log(
        `Extracted values - Keyword: ${keyword}, Clicks: ${clicks}, CTR: ${CTR}, ACOS: ${ACOS}, ROAS: ${ROAS}`
      );

      // Convert values to numbers for comparison
      const numClicks = parseFloat(clicks);
      const numCTR = parseFloat(CTR);
      const numACOS = parseFloat(ACOS);
      const numROAS = parseFloat(ROAS);

      if (
        isNaN(numClicks) ||
        isNaN(numCTR) ||
        isNaN(numACOS) ||
        isNaN(numROAS)
      ) {
        console.log("Skipping row due to invalid data:", row);
        return;
      }

      if (numROAS > 5 && numACOS < 30 && numCTR > 0.1) {
        console.log(`High-performing keyword detected: ${keyword}`);
        highPerforming.push(keyword);
      } else {
        console.log(`Low-performing keyword detected: ${keyword}`);
        lowPerforming.push(keyword);
      }

      keywords.push({
        keyword,
        clicks: numClicks,
        CTR: numCTR,
        ACOS: numACOS,
        ROAS: numROAS,
      });
    })
    .on("end", () => {
      console.log("CSV file processing completed.");
      console.log("Total keywords:", keywords.length);
      console.log("High-performing keywords:", highPerforming);
      console.log("Low-performing keywords:", lowPerforming);

      res.json({
        message: "Analysis completed.",
        totalKeywords: keywords.length,
        highPerforming,
        lowPerforming,
      });
    })
    .on("error", (err) => {
      console.error("Error processing file:", err);
      res.status(500).send("Error processing file.");
    });
});

module.exports = router;
