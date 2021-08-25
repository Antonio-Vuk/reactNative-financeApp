import { Dimensions } from "react-native";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#5D2DFD", // Dark purple
    secondary: "#7F5DF0", // Light purple

    black: "black",
    white: "white",

    green: "#37E39F",
    red: "#F9A8BA",
    gray: "#6A6A6A",
    lightGray: "#dbdbdb",
    lightGray1: "#f5f6fa",

    lightblue: "lightblue",
    lightcoral: "lightcoral",
    lightcyan: "lightcyan",
    lightgoldenrodyellow: "lightgoldenrodyellow",
    lightgray: "lightgray",
    lightgreen: "lightgreen",
    lightpink: "lightpink",
    lightsalmon: "lightsalmon",
    lightseagreen: "lightseagreen",
    lightskyblue: "lightskyblue",
    lightsteelblue: "lightsteelblue",
    lightyellow: "lightyellow",
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 10,
    lineHeight: 45,
    icon: 25,

    // font sizes
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    windowWidth: width,
    windowHeight: height,
    statusBarHeight: Constants.statusBarHeight,
};

export const FONTS = {
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body1,
        lineHeight: 36,
    },
    body2: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body2,
        lineHeight: 30,
    },
    body3: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body3,
        lineHeight: 22,
    },
    body4: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body4,
        lineHeight: 22,
    },
    body5: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body5,
        lineHeight: 22,
    },
};

export const STYLES = {
    shadow: {
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,

        elevation: 10,
    },

    container: {
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
    },
    animationType: "slide",
};
