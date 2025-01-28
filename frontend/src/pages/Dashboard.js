import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h1>Welcome to the Ad Performance Analyzer</h1>
            <p>Use the options below to continue:</p>
            <ul>
                <li>
                    <Link to="/upload">Upload Ad Data</Link>
                </li>
                <li>
                    <Link to="/analyze">View Analysis Results</Link>
                </li>
            </ul>
        </div>
    );
};

export default Dashboard;
