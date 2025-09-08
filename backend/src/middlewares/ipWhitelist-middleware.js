const allowedIPs = ["43.231.48.117","::1"];

const restrictToIPs = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).json({ message: "Access denied: IP not allowed" });
  }
  next();
};

export{
  restrictToIPs
}