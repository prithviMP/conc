let zohoToken = '1000.bb653248cf6f9e99e3cfa0cd140b47ef.b712bacd97fef654a33fca2c18c937e2';
let razorpayToken = '1000.8d8041ac66a1476bf1cc291dacd8a375.569901db3c40e1cfa98b6dc5200826a2';
let tokenExpiry = 0; // Timestamp of when the token will expire
const axios = require('axios');


function getZohoToken() {
  return zohoToken;
}

function setZohoToken(token) {
  zohoToken = token;
}
let accessToken = '1000.c23814633aff48795fd07af3e18acbe1.613f8880977f6ccb64ccac7fa210f68d';
let refreshToken = '1000.8d8041ac66a1476bf1cc291dacd8a375.569901db3c40e1cfa98b6dc5200826a2';;

function setZohoTokens(newAccessToken, newRefreshToken,expiresIn) {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;

  tokenExpiry = Date.now() + expiresIn * 100000;

}



function getAccessToken() {
  return accessToken;
}

function getRefreshToken() {
  return refreshToken;
}

// async function refreshZohoAccessToken() {
//     try {
//       console.log("Refreshing Zoho access token...");
  
//       const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', {
//         refresh_token: "1000.8d8041ac66a1476bf1cc291dacd8a375.569901db3c40e1cfa98b6dc5200826a2",
//         client_id: process.env.ZOHO_CLIENT_ID,
//         client_secret: process.env.ZOHO_CLIENT_SECRET,
//         grant_type: 'refresh_token'
//       });
  
//       if (response.data && response.data.access_token) {
//         const { access_token: newAccessToken } = response.data;
//         setAccessToken(newAccessToken); // Update the stored access token
//         console.log("Zoho access token refreshed successfully.");
//         return newAccessToken;
//       } else {
//         throw new Error("Failed to refresh token: No access token returned from Zoho");
//       }
//     } catch (error) {
//         console.error(error)
//       console.error("Error refreshing Zoho access token:", error.message || error);
//       // Depending on your application's structure, you might want to rethrow the error, handle it here, or even notify an admin
//       throw error; // Rethrow if you plan to handle this error at a higher level
//     }
//   }

async function refreshZohoAccessToken() {
    try {
      console.log("Refreshing Zoho access token...");
  
      // Create a URLSearchParams object with your parameters
      const params = new URLSearchParams();
      params.append('refresh_token', getRefreshToken());
      params.append('client_id', process.env.ZOHO_CLIENT_ID);
      params.append('client_secret', process.env.ZOHO_CLIENT_SECRET);
      params.append('grant_type', 'refresh_token');
  
      // Make the POST request with URL-encoded data
      const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      if (response.data && response.data.access_token) {
        const { access_token: newAccessToken } = response.data;
        setZohoTokens(newAccessToken,getRefreshToken(),response.data.expires_in); // Update the stored access token
        console.log("Zoho access token refreshed successfully.");
        return newAccessToken;
      } else {
        throw new Error("Failed to refresh token: No access token returned from Zoho");
      }
    } catch (error) {
      console.error("Error refreshing Zoho access token:", error.message || error);
      throw error; // Consider your error handling strategy here
    }
  }
function tokenNeedsRefresh() {
    // Check if the current time is greater than or equal to the token's expiry time
    // Buffer time (e.g., 30 seconds) is subtracted to refresh the token before it exactly expires
    return Date.now() >= tokenExpiry - 30000;
  }

function getRazorpayToken() {
  return razorpayToken;
}

function setRazorpayToken(token) {
  razorpayToken = token;
}

module.exports = { getZohoToken,tokenNeedsRefresh,setZohoTokens, setZohoToken, getRazorpayToken, setRazorpayToken ,refreshZohoAccessToken,getAccessToken};
