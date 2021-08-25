import React, { useState, useEffect, useContext } from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
} from "react-native";

import { COLORS, images, SIZES, FONTS } from "../constants";
import { storeData, KEYS } from "../storage";
import { defaultState } from "../store/state";
import { AppContext } from "../contexts";

const onBoardings = [
    {
        title: "Wallets",
        description:
            "Create wallets so you can keep track of your total balance",
        img: images.wallet,
    },
    {
        title: "Categories",
        description:
            "Create categories to know where you spend your money and how you make it",
        img: images.categories,
    },
    {
        title: "Custom fields",
        description:
            "Create custom fields if you have need for storing some other data",
        img: images.customFields,
    },
];

const OnBoardingScreen = (props) => {
    const { state, setState } = useContext(AppContext);
    const [completed, setCompleted] = useState(false);
    const scrollX = new Animated.Value(0);

    useEffect(() => {
        scrollX.addListener(({ value }) => {
            if (
                Math.floor(value / SIZES.windowWidth) ===
                onBoardings.length - 1
            ) {
                setCompleted(true);
            }
        });
        return () => scrollX.removeListener();
    }, []);

    const pressed = async () => {
        await storeData(KEYS.onBoarding, "true");
        defaultState.onBoard = "true";
        setState({ ...defaultState });
    };

    const renderContent = () => {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEnabled
                decelerationRate={0}
                scrollEventThrottle={3}
                snapToAlignment="center"
                showsHorizontalScrollIndicator="false"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            >
                {onBoardings.map((item, index) => {
                    return (
                        <View
                            key={index.toString()}
                            style={{ width: SIZES.windowWidth }}
                        >
                            {/* Image */}
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    top: "30%",
                                }}
                            >
                                <Image
                                    source={item.img}
                                    resizeMode="cover"
                                    style={{
                                        tintColor: COLORS.primary,
                                        width: 200,
                                        height: 200,
                                    }}
                                ></Image>
                            </View>

                            {/* Text */}
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: "10%",
                                    left: 40,
                                    right: 40,
                                }}
                            >
                                <Text
                                    style={{
                                        ...FONTS.h1,
                                        color: COLORS.primary,
                                        textAlign: "center",
                                    }}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={{
                                        ...FONTS.body2,
                                        textAlign: "center",
                                        marginTop: SIZES.base,
                                        color: COLORS.secondary,
                                    }}
                                >
                                    {item.description}
                                </Text>
                            </View>
                            {/* Buttons */}
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    width: 150,
                                    height: 60,
                                    paddingLeft: 20,
                                    justifyContent: "center",
                                    borderTopLeftRadius: 30,
                                    borderBottomLeftRadius: 30,
                                    backgroundColor: COLORS.secondary,
                                }}
                                onPress={pressed}
                            >
                                <Text
                                    style={{ ...FONTS.h2, color: COLORS.white }}
                                >
                                    {completed ? "Let's Go" : "Skip"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </Animated.ScrollView>
        );
    };

    const renderDots = () => {
        const dotPosition = Animated.divide(scrollX, SIZES.windowWidth);

        return (
            <View style={styles.dotContainer}>
                {onBoardings.map((item, index) => {
                    const opacity = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: "clamp",
                    });

                    const dotSize = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [SIZES.base, 17, SIZES.base],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            key={index.toString()}
                            opacity={opacity}
                            style={[
                                styles.dot,
                                { width: dotSize, height: dotSize },
                            ]}
                        ></Animated.View>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>{renderContent()}</View>
            <View style={styles.dotsRootContainer}>{renderDots()}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    dot: {
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        marginHorizontal: SIZES.radius / 2,
    },
    dotContainer: {
        flexDirection: "row",
        height: SIZES.padding,
        justifyContent: "center",
        alignItems: "center",
    },
    dotsRootContainer: {
        position: "absolute",
        bottom: SIZES.windowHeight > 700 ? "30%" : "20%",
    },
});

export default OnBoardingScreen;
