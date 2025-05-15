import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { userId: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    // Attach decoded token data to req.user
    req.user = { userId: decoded.userId };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default authMiddleware;
