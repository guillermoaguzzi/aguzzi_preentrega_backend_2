const authMdw = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  console.log("Access unauthorized");
  console.log(res)
  return res.redirect(`/api/v1/session/login`);
};

const authorization = (roles) => {
  return async (req, res, next) => {
    console.log(
      "🚀 ~ file: auth.middleware.js:9 ~ return ~ req.user.role:",
      req.user.user
    );

    if (!req.user) return res.status(401).json({ message: `Unauthorized` });

    if (!roles.includes(req.user.user.role)) {
      return res.status(401).json({ message: "No enought permissions" });
    }

    next();
  };
};

module.exports = {
  authMdw,
  authorization,
}
