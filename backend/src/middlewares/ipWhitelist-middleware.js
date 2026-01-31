const allowedIPs = [
  "43.231.48.117",
  "127.0.0.1",
  "::1"
];

const restrictToIPs = (req, res, next) => {
  let clientIP = req.ip || req.connection.remoteAddress;

  // Normalize IPv6-mapped IPv4
  if (clientIP?.startsWith("::ffff:")) {
    clientIP = clientIP.replace("::ffff:", "");
  }

  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: IP not allowed",
      ip: clientIP
    });
  }

  next();
};

export { restrictToIPs };
