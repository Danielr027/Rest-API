const handleHttpError = (res, message = "Algo ha ido mal", code = 500) => {
    res.status(code).json({ error: message });
};

module.exports = handleHttpError;
