import axiosInstance from '../api/commonUtils/axiosInstance';
import { API_ENDPOINTS } from '../api/commonUtils/constant';

export const login_form = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const forgot_password = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const get_gallery = async (body) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_GALLERY, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const upcomming_franshise = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LIST_FRANCHISE, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};
export const running_franshise = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.RUNNING_FRANCHISE, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const hero_section = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.HERO_SECTION, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const about_section = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.ABOUT_US, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const benifits_list = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.BENIFITS_LIST, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const franchise_location_list = async (body) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.FRANCHISE_LOCATION, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};
export const social_link = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.SOCIAL_LINK, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const required_items = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REQUIRED_ITEMS, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};
export const staff_items = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.STAFF_DETAILS, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const investment_estimate = async (body) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.INVESTMENT_ESTIMATE, body);
    return response.data;
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};
