module.exports = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers["user-agent"],
    };

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      log.body = req.body;
    }

    console.log("[API LOG]", JSON.stringify(log, null, 2));
  });

  next();
};
