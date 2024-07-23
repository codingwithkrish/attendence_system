import jsonwebtoken from 'jsonwebtoken';
import User from '../models/userModel.js';
import createError from "http-errors";

export const signInAccessToken = (userId:String) => {
return new Promise((resolve, reject) => {
    const payload = {userId};
    const secret = process.env.ACCESS_TOKEN_SECRET || 'defaultSecret';
        jsonwebtoken.sign(payload, secret, {expiresIn:'25s',issuer:"krishgupta.com",audience:userId.toString()  }, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            resolve(token);
        }
);
       
});
}


export const verifyAccessToken = async (req:any, res:any, next:any) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());

    const authHeader = req.headers["authorization"];

    const beareToken = authHeader.split(/\s/);
    console.log(beareToken);
    const token = beareToken[1];

    jsonwebtoken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET ?? 'defaultSecret',
        async (err:any, payload:any) => {
            if (err) {
                const message =
                    err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            const user = await User.findById((payload as { userId: string }).userId);
            if (!user) {
                return res.status(404).json({ error: "User not find" })
            }
            req.user = user;
            next();
        }
    );
};

export const signRefreshToken = (userId:String) => {
    return new Promise((resolve, reject) => {
        const payload = {userId};
        const secret = process.env.REFRESH_TOKEN_SECRET ?? 'defaultSecret';
        
        jsonwebtoken.sign(payload, secret, { expiresIn: "1y",
            issuer: "krishgupta.com",audience:userId.toString()}, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
};
export const verifyRefreshToken = (refreshToken: string) => {
    return new Promise<String>((resolve, reject) => {
        jsonwebtoken.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET ?? 'defaultSecret',
            (err, paylod) => {
                if (err) return reject(createError.Unauthorized());
                const userId = (paylod as { aud: string }).aud;
                resolve(userId);
            }
        );
    });
};
