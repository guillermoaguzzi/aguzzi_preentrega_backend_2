const authMdw = (req, res, next) => {
  console.log("Access unauthorized");
  if (req.session?.user) {
    return next();
  }

  return res.redirect(`/api/v1/session/login`);
};

module.exports = authMdw;
