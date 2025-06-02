import api from "../security/axiosConfig";

export const login = async (username: string, password: string) => {
 
    const response = await api.post("/login", { username, password });
    // Aquí suponemos que el backend devuelve el token en response.data.token
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const obtenerPerfil = async () => {
    const response = await api.get("/perfil");
    return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
