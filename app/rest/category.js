import axios from "axios";
import { defaultState } from "../store/state";
import { url } from "./endpoint";

const insertCategoryRest = (category) => {
    return axios.post(url + "category", category, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

const updateCategoryRest = (category) => {
    return axios.put(url + "category", category, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

const deleteCategoryRest = (cateogyId) => {
    return axios.delete(url + "category/" + cateogyId, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

export { insertCategoryRest, updateCategoryRest, deleteCategoryRest };
