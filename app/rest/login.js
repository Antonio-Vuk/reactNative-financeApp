import axios from "axios";
import { url } from "./endpoint";

const register = (email, password) => {
    return axios.post(url + "users", {
        email,
        password,
    });
};

const login = (email, password) => {
    return axios.post(url + "auth", {
        email,
        password,
    });
};
export { login, register };
