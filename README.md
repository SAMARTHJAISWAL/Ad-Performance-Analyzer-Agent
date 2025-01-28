# Ad Performance Analyzer

## **Project Overview**
The Ad Performance Analyzer is a web application designed to analyze advertisement data and provide insights into ad performance. Users can upload CSV files containing ad data, and the system evaluates the keywords to identify high- and low-performing keywords. The application consists of a **React-based frontend**, a **Node.js backend**, and integrates with an LLM (Large Language Model) to process and summarize the ad performance. This tool helps marketers and advertisers make data-driven decisions by highlighting areas of improvement and recommending changes to optimize their campaigns.

---

## **Architecture Diagram**

```plaintext
+-------------+           +------------------+          +------------------+           +---------------------+
|  Frontend   |   ---->   |  Backend (Node)  |   ---->  |  LangChain Agent |   ---->   |     LLM API         |
|   (React)   |           |    /api/upload   |          | Analyze Keywords |           |                     |
|             |           |   /api/analyze   |          |  Adjust Keywords |           |                     |
+-------------+           +------------------+          +------------------+           +---------------------+
```

---

## **Setup Instructions**

Follow these steps to set up and run the project locally:

### **Backend Setup**
1. Clone the repository and navigate to the `backend` folder:
   ```bash
   git clone <repo-url>
   cd AdPerformanceAnalyzer/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up a `.env` file in the `backend` directory:
   ```plaintext
   PORT=5005
   OPENAI_API_KEY=<your-openai-api-key>
   ```
4. Start the backend server:
   ```bash
   node index.js
   ```

### **Frontend Setup**
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:3000`.

---

## **API Documentation**

### **1. `/api/upload` (POST)**
- **Description**: Uploads a CSV file containing ad data.
- **Request**:
  - Content-Type: `multipart/form-data`
  - Body:
    ```bash
    file=@path/to/ad-data.csv
    ```
- **Response**:
  - Success:
    ```json
    { "message": "File uploaded successfully: test.csv" }
    ```
  - Error:
    ```json
    { "error": "File upload failed" }
    ```

### **2. `/api/analyze` (POST)**
- **Description**: Analyzes the uploaded CSV file for keyword performance.
- **Request**:
  - Content-Type: `application/json`
  - Body:
    ```json
    { "fileName": "test.csv" }
    ```
- **Response**:
  - Success:
    ```json
    {
      "message": "Analysis completed.",
      "totalKeywords": 3,
      "highPerforming": ["keyword1", "keyword3"],
      "lowPerforming": ["keyword2"]
    }
    ```
  - Error:
    ```json
    { "error": "Analysis failed" }
    ```

---

## **Assumptions**
1. The input CSV file adheres to the required format and contains valid ad data.
2. The target audience for this tool includes digital marketers and advertisers looking to optimize their campaigns.
3. The LLM API is available and provides responses within a reasonable time.
4. The frontend and backend will run on the same machine during development.

---

## **Future Improvements**
1. **Enhanced Data Validation**:
   - Validate the uploaded CSV file format and content to ensure proper analysis.
   
2. **Improved UI/UX**:
   - Add better styling and user interaction, including file upload progress indicators.

3. **Historical Data Tracking**:
   - Store historical analyses in a database to allow users to track performance over time.

4. **Advanced Reporting**:
   - Generate downloadable PDF or Excel reports with detailed keyword insights and recommendations.

5. **User Authentication**:
   - Add login functionality to allow multiple users to access and manage their data securely.

6. **Support for Multiple Languages**:
   - Enhance the LLM prompts to work with ad data in multiple languages for global users.

7. **Integration with Ad Platforms**:
   - Directly fetch ad data from platforms like Google Ads or Facebook Ads instead of requiring manual uploads.

---
