import React from 'react';

const AnalysisResults = ({ results }) => {
    if (!results) return <p>Loading results...</p>;

    return (
        <div>
            <h2>Analysis Results</h2>
            <p>{results.message}</p>
            <h3>High-Performing Keywords</h3>
            <ul>
                {results.highPerforming.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>
            <h3>Low-Performing Keywords</h3>
            <ul>
                {results.lowPerforming.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>
        </div>
    );
};

export default AnalysisResults;
