const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: "536672399189-2epmd9slldtr1uih72bqsdqor20gp4mh.apps.googleusercontent.com",
  clientSecret:"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",
  callbackURL: '/auth/google/callback'
},
function(accessToken, refreshToken, profile, done) {
  // Here you'd find or create the user in your DB
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
