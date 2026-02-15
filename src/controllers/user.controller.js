import { 
    createUser,
    getUserById,
    loginUser,
    updateUser,
} from "../services/user.service.js";

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

export async function loginController(req, res) {
    try {
        const {username, password} = req.body;

        const data = await loginUser({username, password});

        return res.status(200).json(data);
    } catch (err) {
        if (
            err.message === "Dados inválidos" ||
            err.message === "Usuário ou senha inválidos"
        ) {
            return res.status(401).json({
                message: err.message,
            });
        }

        console.error(err);
        return res.status(500).json({
            message: "Erro ao fazer login",
        });
    }
}

export async function getMeController(req, res) {
    try {
        const user = await getUserById(req.user.id);
        return res.json(user);
    } catch(err) {
        console.error(err)
        return res.status(404).json({message: "Usuário não encontrado"})
    }
}

export async function updateUserController(req, res) {
    try {
        const { username, password, avatar } = req.body;

        const user = await updateUser({
            id: req.user.id,
            username: username || null,
            password: password || null,
            avatar: avatar || null
        });

        return res.json(user);
    } catch (err){
        if (err.code == "23505") {
            return res.status(409).json({message: "Nome se usuário já existe"});
        }

        console.error(err)
        return res.status(500).json({message: "Erro ao atualziar o usuário"})
    }
}

export async function getUserByIdController(req, res) {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}