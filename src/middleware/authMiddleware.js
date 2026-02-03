import { jwt } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({message: "Token não informado"});
    }

    const [, token] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.sub,
            username: decoded.username
        };

        next();
    } catch {
        return res.status(401).json({message: "Token inválido"});
    }
}