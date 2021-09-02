import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    Image,
    FlatList,
} from "react-native";
import {
    AppPageTitle,
    TransactionTypeSelector,
    SelectCategory,
    AppDivider,
    AppDatePickerModal,
    GoBackArrow,
    PageTitle,
    CircleButton,
    ImageInputList,
} from "../components";
import { BlurView } from "expo-blur";
import {
    SIZES,
    STYLES,
    icons,
    COLORS,
    constants,
    FONTS,
    images,
} from "../constants";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { AppContext } from "../contexts";
import {
    createTransactionController,
    updateTransactionController,
} from "../controllers/transactionController";
import {
    getDifferentWalletById,
    getCategory,
    successMessage,
    getWalletNameById,
    showError,
    isNumeric,
} from "../utils/helpersFunctions";
import routes from "../navigation/routes";
import CustomFields from "../components/CustomFields";
import { defaultState } from "../store/state";
import { getCategoryHF } from "../utils/helpersFunctions";
import useLocation from "../hooks/useLocation";

const TransactionScreen = ({ route, navigation }) => {
    const { state, setState } = useContext(AppContext);
    const [editMode] = useState(route.params.editMode);
    const [title, setTitle] = useState();
    const [type, setType] = useState(constants.income);
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState("");
    const [toAccountId, setToAccountId] = useState();
    const [fromAccountId, setFromAccountId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [imageUris, setImageUris] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (editMode == true) {
            const transaction = route.params.transaction;
            setTitle("Edit Transaction");
            setType(transaction.type);
            setAmount(transaction.amount.toString());
            setDate(new Date(transaction.date));
            setNote(transaction.note);
            setToAccountId(transaction.toAccountId);
            setFromAccountId(transaction.fromAccountId);
            setCategoryId(transaction.categoryId);
            if (defaultState.user != constants.offline) {
                if (Array.isArray(transaction.imageUris)) {
                    setImageUris(transaction.imageUris);
                } else {
                    setImageUris(JSON.parse(transaction.imageUris));
                }
            }
        } else {
            setTitle("New Transaction");
            if (state.wallets.length > 0) {
                if (toAccountId == undefined) {
                    setToAccountId(state.wallets[0].id);
                }
                if (fromAccountId == undefined) {
                    setFromAccountId(state.wallets[0].id);
                }
            }
        }

        if (route.params.wallet != undefined) {
            const wallet = route.params.wallet;
            setToAccountId(wallet.id);
            setFromAccountId(wallet.id);
        }
    }, []);

    useEffect(() => {
        if (type == constants.transfer) {
            if (toAccountId == fromAccountId) {
                setFromAccountId(getDifferentWalletById(toAccountId).id);
            }
        }
    }, [toAccountId]);

    useEffect(() => {
        if (type == constants.transfer) {
            if (toAccountId == fromAccountId) {
                setToAccountId(getDifferentWalletById(fromAccountId).id);
            }
        }
    }, [fromAccountId]);

    useEffect(() => {
        if (type == constants.transfer) {
            if (toAccountId != undefined && fromAccountId != undefined) {
                if (toAccountId == fromAccountId) {
                    setToAccountId(getDifferentWalletById(fromAccountId).id);
                }
            }
        } else {
            setCategoryId(getCategoryHF(type));
        }
    }, [type]);

    const handleAdd = (uri) => {
        setImageUris([...imageUris, uri]);
    };

    const handleRemove = (uri) => {
        setImageUris(imageUris.filter((imageUri) => imageUri != uri));
    };

    const handleSave = async () => {
        if (defaultState.user != constants.offline) {
            defaultState.loading = true;
            setState({ ...defaultState });
        }
        try {
            defaultState.customFields.forEach((custom) => {
                if (custom.type == constants.number) {
                    if (isNumeric(custom.value) == false) {
                        throw "Custom field type number must be numeric!";
                    }
                }
            });
            if (categoryId == undefined) {
                throw "Category is not selected!";
            }
            if (type == constants.income) {
                if (toAccountId == undefined) {
                    throw "Wallet must be specified!";
                }
                if (getWalletNameById(toAccountId) == "-") {
                    throw "Wallet is not specified!";
                }
            }
            if (type == constants.expense) {
                if (fromAccountId == undefined) {
                    throw "Wallet must be specified!";
                }
                if (getWalletNameById(fromAccountId) == "-") {
                    throw "Wallet is not specified!";
                }
            }

            if (type == constants.transfer) {
                if (fromAccountId == undefined || toAccountId == undefined) {
                    throw "Wallet must be specified!";
                }
                if (getWalletNameById(toAccountId) == "-") {
                    throw "Wallet is not specified!";
                }
                if (getWalletNameById(fromAccountId) == "-") {
                    throw "Wallet is not specified!";
                }
            }

            if (editMode == true) {
                const transaction = route.params.transaction;
                await updateTransactionController({
                    type,
                    amount,
                    date,
                    note,
                    toAccountId,
                    fromAccountId,
                    categoryId,
                    id: transaction.id,
                    imageUris,
                });
                successMessage("Transaction edited!");
                route.params.callBack();
            } else {
                await createTransactionController({
                    amount,
                    categoryId,
                    date,
                    note,
                    toAccountId,
                    fromAccountId,
                    type,
                    imageUris,
                    location,
                });
                successMessage("Transaction created!");
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
                    <GoBackArrow text={true} />
                    <View style={{ flexDirection: "row", height: 50 }}>
                        <PageTitle
                            title={title}
                            style={{ paddingTop: SIZES.padding, flex: 1 }}
                        />
                        {((categoryId != undefined &&
                            amount != "" &&
                            state.wallets.length > 0) ||
                            (type == constants.transfer && amount != "")) && (
                            <CircleButton onPress={handleSave} />
                        )}
                    </View>

                    {state.user != constants.offline && (
                        <ImageInputList
                            imageUris={imageUris}
                            onAddImage={handleAdd}
                            onRemoveImage={handleRemove}
                        />
                    )}

                    <TransactionTypeSelector type={type} setType={setType} />

                    {type != constants.transfer && (
                        <CategorySectionTitle
                            type={type}
                            categoryId={categoryId}
                        />
                    )}
                </View>

                {state.categories.length > 0 && type != constants.transfer && (
                    <SelectCategory
                        type={type}
                        categoryId={categoryId}
                        setCategoryId={setCategoryId}
                    />
                )}
                <RenderAccounts
                    type={type}
                    toAccountId={toAccountId}
                    setToAccountId={setToAccountId}
                    fromAccountId={fromAccountId}
                    setFromAccountId={setFromAccountId}
                />

                <RenderTransactionDetails
                    amount={amount}
                    setAmount={setAmount}
                    date={date}
                    setDate={setDate}
                    note={note}
                    setNote={setNote}
                />

                {type != constants.transfer && (
                    <RenderCustomFields categoryId={categoryId} />
                )}
                <View style={{ height: 100 }}></View>
            </ScrollView>
        </View>
    );
};

const CategorySectionTitle = ({ type, categoryId }) => {
    const navigation = useNavigation();
    const { state } = useContext(AppContext);

    const title = () => {
        const length = state.categories.filter(
            (item) => item.type == type || item.type == constants.both
        ).length;
        if (length == 0) {
            return "Create category to add transaction";
        }
        if (length > 0 && categoryId == undefined) {
            return "Category: -";
        }
        if (length > 0 && categoryId != undefined) {
            return "Category: " + getCategory(categoryId).name;
        }
    };
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: SIZES.padding,
                paddingTop: SIZES.padding,
                ...STYLES.container,
                ...STYLES.shadow,
            }}
        >
            <Text
                style={{
                    flex: 1,
                    ...FONTS.h2,
                }}
            >
                {title()}
            </Text>
            <TouchableOpacity
                style={{
                    width: 50,
                    justifyContent: "center",
                    alignItems: "flex-end",
                    paddingRight: 5,
                }}
                onPress={() => {
                    navigation.navigate(routes.category, {
                        editMode: false,
                        category: {},
                    });
                }}
            >
                <FontAwesome name={icons.plus} size={20} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    );
};

const RenderAccounts = ({
    type,
    toAccountId,
    setToAccountId,
    fromAccountId,
    setFromAccountId,
}) => {
    const navigation = useNavigation();
    const { state } = useContext(AppContext);
    return (
        <View
            style={{
                marginTop: SIZES.padding,
                ...STYLES.container,
                ...STYLES.shadow,
                marginHorizontal: SIZES.padding,
            }}
        >
            <View style={{ flexDirection: "row", flex: 1 }}>
                <Text style={{ ...FONTS.h2, flex: 1 }}>
                    {state.wallets.length == 0
                        ? "Create Wallet to add transaction."
                        : "Wallets"}
                </Text>
                <TouchableOpacity
                    style={{
                        height: "100%",
                        width: SIZES.lineHeight,
                        justifyContent: "center",
                        alignItems: "flex-end",
                    }}
                    onPress={() => {
                        navigation.navigate(routes.wallet, { editMode: false });
                    }}
                >
                    <FontAwesome name={icons.plus} size={20} />
                </TouchableOpacity>
            </View>

            {state.wallets.length > 0 && (
                <>
                    {(type == constants.income ||
                        type == constants.transfer) && (
                        <RowContainer
                            title="To Wallet"
                            picker={
                                <WalletPicker
                                    source={toAccountId}
                                    setSource={setToAccountId}
                                    type={type}
                                />
                            }
                        />
                    )}
                    {type == constants.transfer && <AppDivider />}
                    {(type == constants.expense ||
                        type == constants.transfer) && (
                        <RowContainer
                            title="From Wallet"
                            rotate={true}
                            picker={
                                <WalletPicker
                                    source={fromAccountId}
                                    setSource={setFromAccountId}
                                    type={type}
                                />
                            }
                        />
                    )}
                </>
            )}
        </View>
    );
};

const WalletPicker = ({ source, setSource, type }) => {
    const { state } = useContext(AppContext);
    const [visible, setVisible] = useState(false);

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSource(item.id);
                    setVisible(false);
                }}
            >
                <View
                    style={{
                        height: SIZES.lineHeight,
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ textAlign: "center", ...FONTS.h4 }}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Modal visible={visible} transparent>
                <View
                    style={{
                        paddingTop: SIZES.statusBarHeight,
                        paddingBottom: SIZES.padding * 2,
                        paddingHorizontal: SIZES.padding,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(false);
                        }}
                    >
                        <BlurView
                            intensity={60}
                            tint="dark"
                            style={{ height: "100%" }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    width: "100%",
                                    justifyContent: "center",
                                }}
                            >
                                <View
                                    style={{
                                        alignSelf: "center",
                                        backgroundColor: COLORS.white,
                                        width: "40%",
                                    }}
                                >
                                    <FlatList
                                        data={state.wallets}
                                        keyExtractor={(item) =>
                                            item.id.toString()
                                        }
                                        renderItem={renderItem}
                                        ItemSeparatorComponent={() => (
                                            <AppDivider />
                                        )}
                                    />
                                </View>
                            </View>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={() => {
                    if (type == constants.income && source == undefined) {
                        setVisible(true);
                    }
                    if (type == constants.expense && source == undefined) {
                        setVisible(true);
                    }
                    if (state.wallets.length > 0) {
                        setVisible(true);
                    }
                }}
                style={{
                    flex: 1,
                    height: SIZES.lineHeight,
                    alignItems: "flex-end",
                    justifyContent: "center",
                }}
            >
                {source != undefined && (
                    <Text>{getWalletNameById(source)}</Text>
                )}
                {source == undefined && <Text>-</Text>}
            </TouchableOpacity>
        </>
    );
};

const RowContainer = ({ title, rotate = false, picker }) => {
    return (
        <>
            <View
                style={{
                    height: SIZES.lineHeight,
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Image
                    source={images.send}
                    style={{
                        width: SIZES.icon,
                        height: SIZES.icon,
                        top: -4,
                        tintColor: COLORS.primary,
                        transform: [{ rotateY: rotate ? "180deg" : "0deg" }],
                    }}
                ></Image>
                <Text
                    style={{ paddingLeft: SIZES.padding, ...FONTS.h3, flex: 1 }}
                >
                    {title}
                </Text>
                {picker}
            </View>
        </>
    );
};
const RenderTransactionDetails = ({
    amount,
    setAmount,
    date,
    setDate,
    note,
    setNote,
}) => {
    return (
        <View
            style={{
                marginTop: SIZES.padding,
                marginHorizontal: SIZES.base,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                ...STYLES.shadow,
                paddingTop: SIZES.base,
            }}
        >
            <Text style={{ ...FONTS.h2 }}> Transaction Details </Text>
            <View
                style={{
                    paddingHorizontal: SIZES.padding,
                }}
            >
                <RenderAmountInput amount={amount} setAmount={setAmount} />
                <AppDivider />
                <AppDatePickerModal
                    date={date}
                    setDate={setDate}
                    visible={false}
                />
                <AppDivider />
                <RenderNoteInput note={note} setNote={setNote} />
            </View>
        </View>
    );
};

const RenderAmountInput = ({ amount, setAmount }) => {
    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    height: SIZES.lineHeight,
                    alignItems: "center",
                }}
            >
                <FontAwesome
                    name={icons.money}
                    size={SIZES.icon}
                    color={COLORS.primary}
                    style={{ paddingRight: SIZES.padding }}
                />
                <Text style={{ ...FONTS.h3 }}>Amount:</Text>
                <TextInput
                    value={amount}
                    onChangeText={(text) => {
                        setAmount(text);
                    }}
                    style={{
                        flex: 1,
                        ...FONTS.body3,
                        textAlign: "right",
                    }}
                    placeholder="Amount"
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
};

const RenderNoteInput = ({ note, setNote }) => {
    const [modal, setModal] = useState(false);
    const [text, setText] = useState(note);
    const textinput = useRef();

    useEffect(() => {
        if (modal == true) {
            textinput.current.focus();
            setText(note);
        }
    }, [modal]);

    return (
        <>
            <Modal visible={modal} animationType={STYLES.animationType}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.white,
                        paddingTop: SIZES.statusBarHeight,
                        paddingHorizontal: SIZES.padding,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <GoBackArrow
                            onPress={() => {
                                Keyboard.dismiss();
                                setModal(false);
                            }}
                        />
                        <AppPageTitle title="Create Note" />
                        <View style={{ width: 50, height: SIZES.lineHeight }}>
                            {text != "" && text != undefined && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setNote(text);
                                        setModal(false);
                                    }}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <FontAwesome
                                        name={icons.check}
                                        size={30}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <TextInput
                        placeholder="note"
                        autoCorrect={false}
                        ref={textinput}
                        multiline
                        style={{
                            ...FONTS.body2,
                        }}
                        value={text}
                        onChangeText={(text) => setText(text)}
                    />
                </ScrollView>
            </Modal>

            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <View
                    style={{
                        flex: 1,
                        height: SIZES.lineHeight,
                        alignItems: "center",
                        flexDirection: "row",
                        alignSelf: "flex-start",
                    }}
                >
                    <FontAwesome
                        name={icons.note}
                        size={SIZES.icon}
                        color={COLORS.primary}
                        style={{ paddingRight: SIZES.padding }}
                    />
                    <Text style={{ ...FONTS.h3 }}>Note:</Text>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModal(true);
                            }}
                        >
                            <Text
                                placeholder="Note"
                                numberOfLines={1}
                                style={{
                                    color:
                                        note == ""
                                            ? COLORS.lightgray
                                            : COLORS.black,
                                    textAlign: "right",
                                    ...FONTS.body3,
                                }}
                            >
                                {note == "" ? "note" : note}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

const RenderCustomFields = ({ categoryId }) => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                marginTop: SIZES.padding,
                marginHorizontal: SIZES.base,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                ...STYLES.shadow,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    height: SIZES.lineHeight,
                    alignItems: "center",
                }}
            >
                <Text style={{ ...FONTS.h2, flex: 1 }}> Custom Fields </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate(routes.customFields)}
                    style={{
                        height: "100%",
                        width: 50,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name={icons.settings}
                        size={25}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>

            <View
                style={{
                    margin: SIZES.base,
                }}
            >
                <CustomFields categoryId={categoryId} />
            </View>
        </View>
    );
};

export default TransactionScreen;
