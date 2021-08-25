import { useState, useEffect } from "react";
import * as Network from "expo-network";

const useNetwork = (props) => {
    const [network, setNetwork] = useState();

    const getNetwork = async () => {
        try {
            const { isInternetReachable } =
                await Network.getNetworkStateAsync();
            setNetwork(isInternetReachable);
        } catch (error) {
            showError(error);
        }
    };

    useEffect(() => {
        getNetwork();
    }, []);

    return network;
};

export default useNetwork;
