// Configuration for Learn Reward App
const CONFIG = {
    // Gemini API Key - Get it from https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: localStorage.getItem('gemini_api_key') || ''
};

// Function to set and save Gemini API Key
function setGeminiApiKey(key) {
    if (!key || key.trim() === '') {
        console.error('❌ API key cannot be empty');
        return false;
    }
    CONFIG.GEMINI_API_KEY = key.trim();
    localStorage.setItem('gemini_api_key', key.trim());
    console.log('✅ Gemini API Key saved successfully');
    return true;
}

// Function to get Gemini API Key
function getGeminiApiKey() {
    return CONFIG.GEMINI_API_KEY;
}

// Function to clear Gemini API Key
function clearGeminiApiKey() {
    CONFIG.GEMINI_API_KEY = '';
    localStorage.removeItem('gemini_api_key');
    console.log('✅ Gemini API Key cleared');
}

// Initialize CONFIG from localStorage on page load
function initializeConfig() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        CONFIG.GEMINI_API_KEY = savedKey;
        console.log('✅ Gemini API Key loaded from localStorage');
    }
}

// Auto-initialize on script load
initializeConfig();
