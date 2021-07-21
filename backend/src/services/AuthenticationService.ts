import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express';

interface IJWTokenContent {
  _id: string
  username: string
  email: string
}

export default new class AuthenticationService {
  verifyJWT(req: any, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).json({ message: 'No token provided.' });
    
    jwt.verify(token, `${process.env.JWT_PRIVATE}`, (err: any, decoded: any) => {
      if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
      req.userid = decoded._id;
      next();
    });
  }

  generateToken({ _id, username, email}: IJWTokenContent) {
    const token = jwt.sign({ _id, username, email }, `${process.env.JWT_PRIVATE}`, { expiresIn: "2 days" })
    return token
  }
}