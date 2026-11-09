import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import FileUpload from '../components/FileUpload';

const UploadPage = () => {
    const navigate = useNavigate();

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData);
            alert(response.data);
            navigate('/analyze', { state: { fileName: file.name } });
        } catch (error) {
            console.error('Upload failed:', error.response || error);
            alert(error.response?.data || 'File upload failed.');
        }
    };

    return (
        <div>
            <h1>Upload Ad Data</h1>
            <FileUpload onUpload={handleFileUpload} />
        </div>
    );
};

export default UploadPage;
