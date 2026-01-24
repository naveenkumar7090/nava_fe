// API Configuration
export const API_CONFIG = {
  // Use environment variable if available, otherwise use production URL
  BASE_URL: process.env.REACT_APP_API_URL || 'http://13.235.0.135:3000',
  
  // Development fallback
  DEV_URL: 'http://localhost:8000',
  
  // External API configuration (for direct calls if needed)
  EXTERNAL_API: {
    BASE_URL: 'http://13.235.0.135:3000',
    AUTH_TOKEN: 'admin_access_token'
  },
  
  // Timeout configuration
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Helper function to get the correct API URL
export const getApiUrl = () => {
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🔗 Using production API URL:", API_CONFIG.BASE_URL);
  
  // Always use the production AWS Elastic Beanstalk URL
  return API_CONFIG.BASE_URL;
};
