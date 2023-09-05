const passport = require("passport");

function handlePolicies(policies) {
  return (req, res, next) => {
    console.log(
      "🚀 ~ file: handle-policies.middleware.js:4 ~ handlePolicies ~ policies:",
      policies
    );
    if (policies.length === 1 && policies[0] === "PUBLIC") {
      return next();
    }

    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      console.log(
        "🚀 ~ file: handle-policies.middleware.js:12 ~ passport.authenticate ~ userJWT:",
        userJWT
      );
      if (err) {
        return next(err);
      }
      if (!userJWT) {
        return res
          .status(401)
          .send({ message: "Access denied. Expired or invalid Token." });
      }
      if (policies.includes(userJWT.user.role)) {
        req.user = userJWT;
        return next();
      } else {
        return res
          .status(403)
          .send({ message: "Access denied. User role unauthorized." });
      }
    })(req, res, next);
  };
}

module.exports = handlePolicies;
