import axios from "axios";
import { defaultState } from "../store/state";
import { url } from "./endpoint";

const insertCustomFieldRest = (fieldName, fieldType, listItems, category) => {
    return axios.post(
        url + "customField",
        {
            fieldName,
            fieldType,
            listItems,
            category,
        },
        {
            headers: {
                "x-auth-token": defaultState.token,
            },
        }
    );
};

const updateCustomFieldRest = (name, id) => {
    return axios.put(
        url + "customField",
        {
            name,
            id,
        },
        {
            headers: {
                "x-auth-token": defaultState.token,
            },
        }
    );
};
const deleteCustomFieldRest = (id) => {
    return axios.delete(url + "customField/" + id, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

export { insertCustomFieldRest, updateCustomFieldRest, deleteCustomFieldRest };
