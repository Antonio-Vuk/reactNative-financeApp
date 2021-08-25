import React from "react";
import MapView from "react-native-maps";
import { SIZES } from "../constants";

const LocationViewer = ({ location }) => {
    return (
        <>
            {location != undefined && (
                <MapView
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.05,
                    }}
                    style={{
                        paddingVertical: 20,
                        alignSelf: "center",
                        width: SIZES.windowWidth - 50,
                        height: SIZES.windowWidth - 50,
                        borderRadius: 30,
                    }}
                />
            )}
        </>
    );
};

export default LocationViewer;
