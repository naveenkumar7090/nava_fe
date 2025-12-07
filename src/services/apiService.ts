import axios from 'axios';

// Base API configuration - External API for account/profile data
const API_BASE_URL = 'http://13.235.0.135:3000';
const AUTH_TOKEN = 'admin_access_token';

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'auth-token': AUTH_TOKEN,
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    } else if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`);
      console.error('Error details:', error.response.data);
    } else if (error.request) {
      console.error('🌐 Network Error: No response received');
    } else {
      console.error('⚠️ Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface AccountUser {
  id: number;
  name: string;
  email: string | null;
  mobile?: string;
  phone?: string; // Keep for backward compatibility
  address?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  dob?: string; // Keep for backward compatibility
  timeOfBirth?: string;
  tob?: string; // Keep for backward compatibility
  timeOfBirthApx?: string | null;
  lat?: number;
  lon?: number;
  timezoneOffset?: string;
  gender?: string;
  sunSign?: {
    name: string;
    image: string;
    data: any;
  } | string;
  moonSign?: {
    name: string;
    image: string;
    data: any;
  } | string;
  // Add other fields as needed based on actual API response
}

export interface UserProfile {
  id: number;
  name: string;
  relation?: string;
  email?: string | null;
  mobile?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  // Add other fields as needed based on actual API response
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch account users information (all users)
 */
export const fetchAccountUsers = async (): Promise<AccountUser[]> => {
  try {
    const response = await apiClient.get('/account/users');
    
    // Handle different possible response structures
    if (response.data?.data) {
      return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Unexpected response structure for account users:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching account users:', error);
    throw new Error('Failed to fetch account users');
  }
};

/**
 * Fetch specific account user by ID
 */
export const fetchAccountUserById = async (userId: number): Promise<AccountUser | null> => {
  try {
    const response = await apiClient.get(`/account/users/${userId}`);
    
    // The API returns data directly (not nested under 'data' property)
    if (response.data && typeof response.data === 'object' && response.data.id) {
      console.log('✅ Successfully fetched account user:', response.data);
      return response.data;
    } else {
      console.warn('Unexpected response structure for account user:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching account user by ID:', error);
    throw new Error(`Failed to fetch account user with ID: ${userId}`);
  }
};

/**
 * Fetch user profiles for a specific user ID
 */
export const fetchUserProfiles = async (userId: number): Promise<UserProfile[]> => {
  try {
    console.log(`🔍 Fetching user profiles for user ID: ${userId}`);
    const response = await apiClient.get(`/userprofile/users/${userId}/profiles`);
    
    console.log('📋 User profiles API response:', response.data);
    
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.profiles && Array.isArray(response.data.profiles)) {
      return response.data.profiles;
    } else if (response.data && typeof response.data === 'object') {
      // If single profile object, wrap in array
      return [response.data];
    } else {
      console.warn('Unexpected response structure for user profiles:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    // Don't throw error, just return empty array to avoid breaking the main user data
    console.warn('Continuing without profiles data...');
    return [];
  }
};

/**
 * Find account user by name (case-insensitive search)
 * This is a fallback function - prefer using fetchAccountUserById with user_id
 */
export const findAccountUserByName = async (accountName: string): Promise<AccountUser | null> => {
  try {
    // Search through all users to find by name
    const users = await fetchAccountUsers();
    const user = users.find(user => 
      user.name.toLowerCase() === accountName.toLowerCase()
    );
    return user || null;
  } catch (error) {
    console.error('Error finding account user by name:', error);
    return null;
  }
};
