import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image } from "react-native";
import { AppButton } from "../components";
import { COLORS, constants, images, SIZES } from "../constants";
import routes from "../navigation/routes";
import { defaultState } from "../store/state";
import { AppContext } from "../contexts";
import { getData, KEYS, loadStorageData, storeData } from "../storage";
import { getDataSQLite } from "../sqLite/sqliteFunctions";

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const { state, setState } = useContext(AppContext);

    const onLoginPress = () => {
        navigation.navigate(routes.login);
    };
    const onRegisterPress = () => {
        navigation.navigate(routes.register, { callback: () => {} });
    };

    const onOfflinePress = async () => {
        await storeData(KEYS.user, constants.offline);
        await loadStorageData();
        await getDataSQLite();
        defaultState.user = constants.offline;
        setState({ ...defaultState });
    };

    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
                paddingHorizontal: SIZES.padding,
                paddingBottom: SIZES.padding * 2,
                backgroundColor: COLORS.white,
            }}
        >
            <Image
                source={images.logo}
                style={{
                    width: SIZES.windowWidth - 40,
                    height: SIZES.windowWidth - 40,
                    alignSelf: "center",
                }}
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    paddingHorizontal: SIZES.padding,
                }}
            >
                <AppButton label="Login" onPress={onLoginPress} />
                <AppButton
                    label="Register"
                    onPress={onRegisterPress}
                    style={{ marginTop: SIZES.base }}
                />

                <AppButton
                    label="Offline work"
                    onPress={onOfflinePress}
                    style={{ marginTop: SIZES.base }}
                />
            </View>
        </View>
    );
};
export default WelcomeScreen;
