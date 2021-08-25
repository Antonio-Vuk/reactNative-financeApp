import axios from "axios";
import { defaultState } from "../store/state";
import { url } from "./endpoint";

const getDataRest = () => {
    return axios.get(url + "data", {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

const deleteUserDataRest = () => {
    return axios.delete(url + "data", {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

const importDataRest = (data) => {
    return axios.post(url + "data", data, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

export { getDataRest, deleteUserDataRest, importDataRest };
