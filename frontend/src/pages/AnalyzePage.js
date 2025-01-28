import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AnalyzePage = () => {
    const location = useLocation();
    const { fileName } = location.state || {}; // Get the file name from the previous page's state
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5005/api/analyze', { fileName });
                setResults(response.data); // Save the results from the API
            } catch (error) {
                console.error('Error fetching analysis results:', error);
                alert('Failed to fetch analysis results.');
            }
        };

        if (fileName) {
            fetchAnalysis();
        }
    }, [fileName]);

    if (!results) return <p>Loading analysis results...</p>; // Show a loading message while fetching data

    return (
        <div>
            <h1>Analysis Results</h1>
            <h3>{results.message}</h3>

            <h2>High-Performing Keywords</h2>
            <ul>
                {results.highPerforming.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>

            <h2>Low-Performing Keywords</h2>
            <ul>
                {results.lowPerforming.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>
        </div>
    );
};

export default AnalyzePage;
