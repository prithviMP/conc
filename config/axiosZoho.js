const axios = require('axios');
const { getAccessToken, tokenNeedsRefresh,refreshZohoAccessToken, } = require('../utils/tokenManager.js');

const axiosZoho = axios.create({
  baseURL: 'https://www.zohoapis.in',
});

axiosZoho.interceptors.request.use(async config => {
  let token = getAccessToken();

  if (tokenNeedsRefresh()) { // Implement your logic to determine if the token needs refresh
    token = await refreshZohoAccessToken();
  }

  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
});

module.exports = axiosZoho;
