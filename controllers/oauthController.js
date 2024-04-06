// // controllers/oauthController.js

// const axios = require('axios');
// const Token = require('../models/tokenModel'); // Adjust the path as necessary

// const refreshTokenIfNeeded = async (req, res, next) => {
//   try {
//     let token = await Token.findOne({ where: { /* Your criteria to find the token */ } });

//     if (!token) {
//       // Handle case where token does not exist
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     if () {
//       // Refresh the token
//       const response = await axios.post('Zoho OAuth Token Endpoint', {
//         refresh_token: token.refreshToken,
//         client_id: 'Your Client ID',
//         client_secret: 'Your Client Secret',
//         redirect_uri: 'Your Redirect URI',
//         grant_type: 'refresh_token',
//       });

//       // Update token in the database
//       await Token.update({ accessToken: response.data.access_token, expiresIn: response.data.expires_in }, { where: { /* Your criteria */ } });

//       // Update the token variable with the new values
//       token = await Token.findOne({ where: { /* Your criteria */ } });
//     }

//     // Attach token to the request so it can be used in the route handler
//     req.token = token;
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = { refreshTokenIfNeeded };
