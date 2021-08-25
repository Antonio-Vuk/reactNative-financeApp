import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { showError } from "../utils/helpersFunctions";
const useLocation = () => {
    const [location, setLocation] = useState();

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestPermissionsAsync();
            if (!granted) {
                return;
            }
            const loc = await Location.getLastKnownPositionAsync();
            if (loc != null) {
                const {
                    coords: { latitude, longitude },
                } = loc;
                setLocation({ latitude, longitude });
            }
        } catch (error) {
            console.log(error.message);
            showError(error);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return location;
};

export default useLocation;
