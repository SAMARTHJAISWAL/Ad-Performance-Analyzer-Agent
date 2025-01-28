const axios = require('axios');

const GEMINI_API_URL = 'AIzaSyBB6uVR9kVh7bF_Bbpwk4isjh7un2BuqsY'; // Replace with actual API endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Ensure this is set in your .env file

exports.analyzeAdPerformance = async (data) => {
    const highPerformanceKeywords = [];
    const lowPerformanceKeywords = [];

    // Analyze keywords from the data
    data.forEach((item) => {
        const { keyword, clicks, CTR, ACOS, ROAS } = item;

        // Check for high-performing keywords
        if (ROAS > 5 && ACOS < 30 && CTR > 0.1) {
            highPerformanceKeywords.push(keyword);
        } else {
            lowPerformanceKeywords.push(keyword);
        }
    });

    // Construct the prompt for Gemini
    const prompt = `You are an expert in ad campaign analysis. Based on the following data:
    High-performing keywords: ${highPerformanceKeywords.join(', ') || 'None'}
    Low-performing keywords: ${lowPerformanceKeywords.join(', ') || 'None'}
    
    Provide a concise summary of the ad performance, focusing on strengths, weaknesses, and actionable improvement suggestions.`;

    try {
        // Make a POST request to Gemini API
        const response = await axios.post(
            `${GEMINI_API_URL}/generate-text`, // Update this endpoint as per Gemini documentation
            {
                model: 'gemini-1', // Replace with the appropriate model
                prompt: prompt,
                maxTokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${GEMINI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Return the summary and keyword analysis
        return {
            summary: response.data.text.trim(), // Adjust based on the response structure
            highPerformanceKeywords,
            lowPerformanceKeywords,
        };
    } catch (error) {
        console.error('Error generating summary with Gemini:', error.message);
        throw new Error('Failed to generate ad performance summary using Gemini.');
    }
};
