const hasRole = (roles) => {
  return (req, res, next) => {
    if (req.user) {
      const { role } = req?.user;

      if (!role || !roles.includes(role)) {
        return res.status(403).json({
          error: "Forbidden.",
        });
      }
    }
    next();
  };
};

module.exports = hasRole;
