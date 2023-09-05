const passport = require("passport");
const GithubStrategy = require("passport-github2");
const userModel = require("../models/users.model");
const {  GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, API_VERSION } = require("./config");




const initializePassportGithub = () => {
    passport.use(
    "github",
    new GithubStrategy(
        {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:8000/api/${API_VERSION}/session/github/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("PROFILE INFO ******", profile);
            let user = await userModel.findOne({ email: profile._json?.email });
            if (!user) {
            let addNewUser = {
                firstName: profile._json.name,
                lastName: "",
                age: 0,
                username: profile._json?.email,
                email: profile._json?.email,
                password: "",
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
            } else {
            // ya existia el usuario
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