import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppButton, AppTextInput, GoBackArrow } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { IconImage } from "./RegisterScreen";
import { login } from "../rest/login";
import { AppContext } from "../contexts";
import jwt_decode from "jwt-decode";
import { defaultState, resetState, saveDataLocalState } from "../store/state";
import { KEYS, loadStorageData, storeData } from "../storage";
import { showError } from "../utils/helpersFunctions";
import { getDataRest } from "../rest/data";

const LoginScreen = () => {
    const { state, setState } = useContext(AppContext);
    const [checked, setChecked] = useState(true);
    const [email, setUsername] = useState();
    const [password, setPassword] = useState();

    const onLoginPress = async () => {
        defaultState.loading = true;
        setState({ ...defaultState });
        try {
            const res = await login(email, password);
            if (res.status == 200) {
                const token = res.data;
                var decoded = jwt_decode(token);
                const user = {
                    id: decoded.id,
                    email: decoded.email,
                };
                await storeData(KEYS.user, JSON.stringify(user));
                await storeData(KEYS.token, token);
                await loadStorageData();
                const result = await getDataRest();
                saveDataLocalState(result);
            }
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1, backgroundColor: COLORS.white }}
            >
                <ScrollView
                    style={{
                        paddingHorizontal: SIZES.padding,
                        paddingTop: SIZES.statusBarHeight,
                    }}
                >
                    <GoBackArrow />
                    <IconImage />
                    <AppTextInput
                        title="Email"
                        icon={icons.user}
                        value={email}
                        setValue={setUsername}
                    />
                    <AppTextInput
                        title="Password"
                        icon={icons.password}
                        value={password}
                        setValue={setPassword}
                        style={{ marginVertical: SIZES.padding }}
                    />
                    <CheckBox checked={checked} setChecked={setChecked} />
                    <AppButton
                        label="Login"
                        onPress={onLoginPress}
                        style={{ marginTop: SIZES.padding }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

const CheckBox = ({ checked, setChecked }) => {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                height: SIZES.lineHeight,
            }}
        >
            <Text style={{ ...FONTS.body3, flex: 1, color: COLORS.primary }}>
                Remember me
            </Text>

            <TouchableOpacity onPress={() => setChecked(!checked)}>
                <Feather
                    name={checked ? "check-circle" : "circle"}
                    size={24}
                    color={COLORS.primary}
                />
            </TouchableOpacity>
        </View>
    );
};
export default LoginScreen;
