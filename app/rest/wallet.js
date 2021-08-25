import axios from "axios";
import { defaultState } from "../store/state";
import { url } from "./endpoint";

const insertWalletRest = (wallet) => {
    return axios.post(url + "wallet", wallet, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

const updateWalletRest = (wallet) => {
    return axios.put(url + "wallet", wallet, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

const deleteWalletRest = (walletId) => {
    return axios.delete(url + "wallet/" + walletId, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

export { insertWalletRest, updateWalletRest, deleteWalletRest };
