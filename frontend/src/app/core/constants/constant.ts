import { environment } from '../../../environments/environment';

export const API_CONSTANTS = {
    defaultError: 'Something went wrong, please try again later.An error occurred',
}

export const FORM_CONSTANTS = {
    defaultValidationMsg: 'Please fill all the mandatory fields'
}

// API Enpoints
const API_BASE_URL = environment.apiBaseURL;

export const BASE_API_ENDPOINTS = {
    AUTH: 'auth',
}

export const WHITE_LIST_URLS = [
    'api/auth/login',
    'api/auth/refresh',
    'api/auth/logout'
];

export const AUTH_API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/${BASE_API_ENDPOINTS.AUTH}/login`,
    LOGOUT: `${API_BASE_URL}/${BASE_API_ENDPOINTS.AUTH}/logout`,
    GET_ROLL_TYPES: `${API_BASE_URL}/${BASE_API_ENDPOINTS.AUTH}/get-master-roles`
}

export const API_ENDPOINTS = {
    auth: AUTH_API_ENDPOINTS,
}
