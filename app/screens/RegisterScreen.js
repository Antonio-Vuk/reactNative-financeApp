import React, { useState, useContext } from "react";
import { KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { AppButton, AppTextInput, GoBackArrow } from "../components";
import { COLORS, icons, images, SIZES } from "../constants";
import { register } from "../rest/login";
import { AppContext } from "../contexts";
import { showMessage } from "react-native-flash-message";
import { defaultState } from "../store/state";
import { showError, successMessage } from "../utils/helpersFunctions";
import { KEYS, storeData } from "../storage";
const RegisterScreen = ({ route }) => {
    const { state, setState } = useContext(AppContext);
    const [email, setEmail] = useState("a.vuk95@gmail.com");
    const [password, setPassword] = useState("123456");
    const [repeatPassword, setRepeatPassword] = useState("123456");

    const onRegisterPress = async () => {
        if (password != repeatPassword || password == "") {
            showMessage({
                message: "Warning",
                description: "Passwords are not match!",
                tyep: "warning",
            });
            return;
        }
        defaultState.loading = true;
        setState({ ...defaultState });

        try {
            const res = await register(email, password);
            const user = res.data;
            const token = res.headers["x-auth-token"];

            await storeData(KEYS.user, JSON.stringify(user));
            await storeData(KEYS.token, token);
            defaultState.user = user;
            defaultState.token = token;
            if (route.params.callback != undefined) {
                route.params.callback();
            }
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    return (
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
                    icon={icons.mail}
                    value={email}
                    setValue={setEmail}
                    style={{ marginVertical: SIZES.padding }}
                />
                <AppTextInput
                    icon={icons.password}
                    title="Password"
                    value={password}
                    setValue={setPassword}
                    style={{ marginBottom: SIZES.padding * 2 }}
                />
                <AppTextInput
                    icon={icons.password}
                    title="Repeat password"
                    value={repeatPassword}
                    setValue={setRepeatPassword}
                    style={{ marginBottom: SIZES.padding * 2 }}
                />
                <AppButton label="Register" onPress={onRegisterPress} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const IconImage = () => {
    const imageSize = SIZES.windowWidth / 2;
    return (
        <Image
            source={images.icon}
            style={{
                width: imageSize,
                height: imageSize,
                alignSelf: "center",
            }}
        />
    );
};

export default RegisterScreen;
