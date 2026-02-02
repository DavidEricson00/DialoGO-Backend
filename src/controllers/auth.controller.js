import { createUser } from "../services/auth.service.js";

export async function createUserController(req, res) {
    try {
        const { username, password } = req.body;

        const user = await createUser({ username, password });

        return res.status(201).json(user)
    } catch (err){
        if (err.code == "23505") {
            return res.status(409).json({message: "Usuário já existe"});
        }
        
        console.error(err)
        return res.status(500).json({message: "Erro ao criar usuário"})
    }
}