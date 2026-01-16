import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login again"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log(decoded);
    // console.log(token);
    req.userId = decoded.id;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default userAuth;
