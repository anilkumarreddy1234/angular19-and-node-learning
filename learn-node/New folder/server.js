const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/oauth.config"); // this is where we configure passport strategies

const app = express();

// Session middleware
app.use(
  session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send(`<a href="/auth/google">Login with Google</a>`);
});

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/");
  res.send(`<h1>Hello ${req.user.displayName}</h1>`);
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication
    res.redirect("/profile");
  }
);

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
