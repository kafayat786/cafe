import axios from 'axios';
import { toast } from 'react-toastify';

// Add request interceptor

// Add response interceptor
axios.interceptors.response.use(
    (response) => {
        toast.success(response.data.message, { autoClose: 1400 });
        // You can handle and modify the response data here if needed
        return response;
    },
    (error) => {
        console.log(error, 'error');
        // You can handle errors here, e.g., show a toast message, logout on certain errors, etc.
        const errorMessage = error?.response?.data?.message || error?.message;
        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getLoggedUser = () => {
    const user = localStorage.getItem('userProfile');
    return user ? JSON.parse(user) : '';
};

export const sendRequest = async (url, data) => {
    const method = data.method || 'post';
    const payload = data.payload || {};
    const headers = data.headers || {};
    const { token, ...rest } = payload;

    let axios_config = {
        method: method,
        url: url,
        headers: {
            'x-access-token': token,
            ...headers
        },
        validateStatus: () => true //Always resolve promise on every http status
    };
    if (method == 'get') {
        axios_config['params'] = rest;
    } else {
        axios_config['data'] = rest;
    }
    try {
        const response = await axios(axios_config);
        // debugger;
        if (response.status === 401) {
            console.log('Something went wrong');
        }
        if (response.status === 406) {
            localStorage.removeItem('token');
            localStorage.removeItem('userProfile');
            window.location.href = '/';
            localStorage.clear();
        }
        return response;
    } catch (error) {
        return error;
    }
};

const axiosWrapper = async (method, url, data, token, isFormData = false) => {
    try {
        const config = {
            method,
            url,
            ...axiosConfig
        };

        if (token) config.headers['Authorization'] = `Bearer ${token}`;

        if (isFormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
            config.data = data; // Use FormData directly for FormData requests
        } else {
            if (data) config.data = data;
        }

        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export default axiosWrapper;
