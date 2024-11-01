const handleHttpError = require("../utils/handleHttpError");

const checkRole = (roles) => (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) return handleHttpError(res, "NOT_ALLOWED", 403);
    next();
};

module.exports = checkRole;
