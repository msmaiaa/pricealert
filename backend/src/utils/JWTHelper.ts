import dotenv from 'dotenv'
dotenv.config()
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token']
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  
  jwt.verify(token, `${process.env.JWT_PRIVATE}`, (err: any, decoded: any) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
    req.userid = decoded._id;
    next();
  });
}

export default verifyJWT