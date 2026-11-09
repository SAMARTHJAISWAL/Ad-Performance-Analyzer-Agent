import React from 'react';

const KeywordList = ({ title, keywords }) => (
    <>
        <h2>{title} ({keywords.length})</h2>
        {keywords.length === 0 ? (
            <p>None</p>
        ) : (
            <ul>
                {keywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>
        )}
    </>
);

const AnalysisResults = ({ results }) => {
    if (!results) return <p>Loading results...</p>;

    return (
        <div>
            <h3>
                {results.message} {results.totalKeywords} keyword(s) analysed
                {results.skippedRows ? `, ${results.skippedRows} row(s) skipped` : ''}.
            </h3>

            {results.summary && (
                <section>
                    <h2>AI Summary</h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{results.summary}</p>
                </section>
            )}
            {results.summaryError && <p><em>{results.summaryError}</em></p>}

            <KeywordList title="High-Performing Keywords" keywords={results.highPerforming} />
            <KeywordList title="Low-Performing Keywords" keywords={results.lowPerforming} />
        </div>
    );
};

export default AnalysisResults;
