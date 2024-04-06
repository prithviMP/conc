// config/passportConfig.js
const passport = require('passport');
const ZohoCRMStrategy = require('passport-zoho-crm').Strategy;
const { setZohoTokens, getRefreshToken, setAccessToken } = require('../utils/tokenManager');

passport.use(new ZohoCRMStrategy({
    clientID: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/zohocrm/callback",
    scope: 'ZohoCRM.modules.ALL',
    response_type: 'code',
    access_type: 'offline'
  },
  async function(accessToken, refreshToken, profile, cb) {
    // Store or update the accessToken and refreshToken in your storage
    setZohoTokens(accessToken, refreshToken);

    // Proceed with user profile
    cb(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
