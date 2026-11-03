import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';
import AnalysisResults from '../components/AnalysisResults';

const AnalyzePage = () => {
    const location = useLocation();
    const { fileName } = location.state || {}; // Set by UploadPage after a successful upload
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!fileName) return;
        const fetchAnalysis = async () => {
            try {
                const response = await api.post('/analyze', { fileName });
                setResults(response.data);
            } catch (err) {
                console.error('Error fetching analysis results:', err);
                setError(err.response?.data?.error || 'Failed to fetch analysis results.');
            }
        };
        fetchAnalysis();
    }, [fileName]);

    if (!fileName) {
        return (
            <div>
                <h1>Analysis Results</h1>
                <p>No file selected. <Link to="/upload">Upload a CSV</Link> first.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Analysis Results: {fileName}</h1>
            {error ? <p role="alert">{error}</p> : <AnalysisResults results={results} />}
            <p><Link to="/upload">Analyse another file</Link></p>
        </div>
    );
};

export default AnalyzePage;
