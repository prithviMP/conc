const axios = require('axios');
const {  getRazorpayToken } = require('../utils/tokenManager');

const axiosRazorpay = axios.create({
  baseURL: 'https://www.razorpay.com',
});

axiosRazorpay.interceptors.request.use(request => {
  const token = getRazorpayToken();
  request.headers.Authorization = `Bearer ${token}`;
  return request;
});

module.exports = axiosRazorpay;
