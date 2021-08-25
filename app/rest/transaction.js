import axios from "axios";
import { defaultState } from "../store/state";
import { url } from "./endpoint";

const insertTransactionRest = (transaction, customFields) => {
    return axios.post(
        url + "transaction",
        {
            transaction,
            customFields,
        },
        {
            headers: {
                "x-auth-token": defaultState.token,
            },
        }
    );
};

const updateTransactionRest = (transaction, customFields) => {
    return axios.put(
        url + "transaction",
        {
            transaction,
            customFields,
        },
        {
            headers: {
                "x-auth-token": defaultState.token,
            },
        }
    );
};

const deleteTransactionRest = (transactionId) => {
    return axios.delete(url + "transaction/" + transactionId, {
        headers: {
            "x-auth-token": defaultState.token,
        },
    });
};

export { insertTransactionRest, updateTransactionRest, deleteTransactionRest };
