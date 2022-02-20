import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SEC } from '../config';

type T = RequestHandler<unknown, unknown, unknown, unknown>
export const verifyToken:T = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SEC, {}, (err, user) => {
            if (err) res.status(403).json('Token is not valid!');
            (req as any).user = user;
            next();
        });
    } else {
        res.status(401).json('You are not authenticated!');
    }
};

export const Sign = (obj:object) => jwt.sign(
    obj,
    JWT_SEC,
    { expiresIn: '3h' },
);

// export const verifyTokenAndAuthorization:T = (req, res, next) => {
//     verifyToken(req, res, () => {
//         if ((req as any).id === req.params.id || req.user.isAdmin) {
//             next();
//         } else {
//             res.status(403).json('You are not alowed to do that!');
//         }
//     });
// };

export const verifyTokenAndAdmin:T = (req, res, next) => {
    verifyToken(req, res, () => {
        if ((req as any).user.isAdmin) {
            next();
        } else {
            res.status(403).json('You are not alowed to do that!');
        }
    });
};
