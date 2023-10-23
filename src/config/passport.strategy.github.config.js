const passport = require("passport");
const GithubStrategy = require("passport-github2");
const SessionService = require("../services/sessions.service")
const userModel = require("../models/users.models");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("./config");

const initializePassportGithub = () => {

  const sessionService = new SessionService();

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:8080/api/v1/session/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ username : profile.username });
          if (!user) {
            let addNewUser = {
              body: {
                firstName: profile.displayName.split(' ')[0],
                lastName: profile.displayName.split(' ').slice(1).join(' '),
                age: 18,
                username: profile.username,
                email: profile.username,
                password: profile.username,
              }
            };

            let newUser = await sessionService.registerUser(addNewUser);

            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });
};

module.exports = initializePassportGithub;
