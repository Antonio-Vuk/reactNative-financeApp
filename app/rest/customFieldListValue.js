import axios from "axios";
import { defaultState } from "../store/state";
import { url } from "./endpoint";

const insertCustomFieldListValueRest = (id, item) => {
    return axios.post(
        url + "customFieldListValue",
        {
            id,
            item,
        },
        {
            headers: {
                "x-auth-token": defaultState.token,
            },
        }
    );
};

const updateCustomFieldListValueRest = (value, id) => {
    return axios.put(
        url + "customFieldListValue",
        {
            value,
            id,
        },
        {
            headers: {
                "x-auth-token": defaultState.token,
            },
        }
    );
};

const deleteCustomFieldListValueRest = (id) => {
    return axios.delete(url + "customFieldListValue/" + id, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

export {
    insertCustomFieldListValueRest,
    updateCustomFieldListValueRest,
    deleteCustomFieldListValueRest,
};
