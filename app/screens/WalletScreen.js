import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, Text, TextInput } from "react-native";
import {
    AppButton,
    AppColorPicker,
    AppDivider,
    CircleButton,
    GoBackArrow,
    PageTitle,
} from "../components";
import { COLORS, constants, FONTS, SIZES, STYLES } from "../constants";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { AppContext } from "../contexts";
import { defaultState } from "../store/state";
import {
    walletSchema,
    deleteWalletController,
    insertWalletController,
    updateWalletController,
} from "../controllers/walletController";
import { showError, getWalletBallance } from "../utils/helpersFunctions";

const WalletScreen = ({ route, navigation }) => {
    const { setState } = useContext(AppContext);
    const [editMode] = useState(route.params.editMode);

    const [title, setTitle] = useState("Create New Wallet");
    const [name, setName] = useState("");
    const [ballance, setBallance] = useState("");
    const [color, setColor] = useState(COLORS.primary);

    useEffect(() => {
        if (editMode == true) {
            setTitle("Edit wallet");
            setName(route.params.wallet.name);
            setBallance(getWalletBallance(route.params.wallet).toString());
            setColor(route.params.wallet.color);
        }
    }, []);

    const onCheckPress = async () => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }

        try {
            const wallet = { name, ballance, color };
            await walletSchema.validate(wallet);
            if (editMode) {
                const newWallet = {
                    id: route.params.wallet.id,
                    name,
                    color,
                    ballance,
                };
                await updateWalletController(newWallet);
            } else {
                await insertWalletController(wallet);
            }
            setState({ ...defaultState });
            navigation.goBack();
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    const deleteWalletPress = async (route) => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            const { id, name, ballance } = route.params.wallet;
            await deleteWalletController(id, name, ballance, () => {
                setState({ ...defaultState });
                navigation.goBack();
            });
        } catch (error) {
            showError(error);
        } finally {
            defaultState.loading = false;
            setState({ ...defaultState });
        }
    };

    return (
        <View
            style={{
                paddingTop: SIZES.statusBarHeight,
                flex: 1,
            }}
        >
            <ScrollView keyboardShouldPersistTaps="handled">
                <View
                    style={{
                        paddingHorizontal: SIZES.padding,
                    }}
                >
                    <GoBackArrow
                        text={true}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            height: 50,
                            justifyContent: "center",
                        }}
                    >
                        <PageTitle
                            style={{ paddingTop: SIZES.padding, flex: 1 }}
                            title={title}
                        />
                        {name != "" && <CircleButton onPress={onCheckPress} />}
                    </View>

                    <AppContainer title="General:">
                        {/* WalletName */}
                        <RenderInputField
                            title="Wallet name"
                            icon={
                                <MaterialIcons
                                    name="drive-file-rename-outline"
                                    size={SIZES.icon}
                                    color={COLORS.primary}
                                />
                            }
                            input={
                                <TextInput
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                    }}
                                    placeholder="Name"
                                    textAlign="right"
                                    style={{
                                        flex: 1,
                                        height: "100%",
                                        ...FONTS.h2,
                                    }}
                                />
                            }
                        />
                        {/* Balance */}
                        <RenderInputField
                            title="Current balance"
                            icon={
                                <AntDesign
                                    name="calculator"
                                    size={SIZES.icon}
                                    color={COLORS.primary}
                                />
                            }
                            input={
                                <TextInput
                                    editable={!editMode}
                                    value={ballance}
                                    onChangeText={(text) => {
                                        setBallance(text);
                                    }}
                                    placeholder="Balance"
                                    textAlign="right"
                                    keyboardType="numeric"
                                    style={{
                                        flex: 1,
                                        height: "100%",
                                        ...FONTS.h2,
                                        color:
                                            editMode == true
                                                ? COLORS.lightGray
                                                : COLORS.black,
                                    }}
                                />
                            }
                        />

                        {/* Color */}
                        <RenderInputField
                            title="Color"
                            icon={
                                <View
                                    style={{
                                        width: SIZES.icon,
                                        height: SIZES.icon,
                                        borderRadius: 15,
                                        backgroundColor: color,
                                    }}
                                ></View>
                            }
                            input={
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <AppColorPicker
                                        source={color}
                                        setSource={setColor}
                                    />
                                </View>
                            }
                        />
                    </AppContainer>
                    {editMode == true && (
                        <AppButton
                            label="Delete Wallet"
                            onPress={() => deleteWalletPress(route)}
                            style={{ ...STYLES.shadow, top: SIZES.padding }}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const AppContainer = ({ title, children }) => {
    return (
        <View style={{ ...STYLES.container, ...STYLES.shadow }}>
            <Text style={{ ...FONTS.h2, flex: 1 }}>{title}</Text>
            <View style={{ paddingVertical: SIZES.padding }}>{children}</View>
        </View>
    );
};
const RenderInputField = ({ title, icon, input }) => {
    return (
        <>
            <View
                style={{
                    height: SIZES.lineHeight,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {icon}
                <Text style={{ paddingLeft: SIZES.padding, ...FONTS.body3 }}>
                    {title}
                </Text>
                {input}
            </View>
            <AppDivider />
        </>
    );
};

export default WalletScreen;
