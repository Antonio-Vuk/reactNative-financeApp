import React from "react";
import { TouchableOpacity, View } from "react-native";
import {
    createBottomTabNavigator,
    BottomTabBar,
} from "@react-navigation/bottom-tabs";
import Svg, { Path } from "react-native-svg";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { COLORS, constants, icons, STYLES } from "../constants";

import HomeScreenNavigator from "./HomeScreenNavigator";
import TransactionNavigator from "./TransactionNavigator";
import SettingsNavigator from "./SettingsNavigator";
import TestingNavigator from "./TestingNavigator";
import routes from "./routes";
import { useContext } from "react/cjs/react.development";
import { AppContext } from "../contexts";
import { EventEmitter } from "../myEvents";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    const { state } = useContext(AppContext);

    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "transparent",
                    elevation: 0,
                },
            }}
            tabBar={(props) => <CustomTabBar props={props} />}
            initialRouteName={routes.home}
        >
            <Tab.Screen
                name={routes.home}
                component={HomeScreenNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons
                            name="home-currency-usd"
                            size={30}
                            color={focused ? COLORS.white : COLORS.primary}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            onCustomPress={() => {
                                EventEmitter.emit(constants.tabChangedEvent);
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name={routes.transactions}
                component={TransactionNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Feather
                            name={icons.list}
                            size={30}
                            color={focused ? COLORS.white : COLORS.primary}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            onCustomPress={() => {
                                EventEmitter.emit(constants.myEvent);
                                EventEmitter.emit(constants.tabChangedEvent);
                            }}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name={routes.test}
                component={TestingNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Feather
                            name="settings"
                            size={30}
                            color={focused ? COLORS.white : COLORS.primary}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            onCustomPress={() => {
                                EventEmitter.emit(constants.tabChangedEvent);
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name={routes.settings}
                component={SettingsNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Feather
                            name="more-horizontal"
                            size={30}
                            color={focused ? COLORS.white : COLORS.primary}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            onCustomPress={() => {
                                EventEmitter.emit(constants.tabChangedEvent);
                            }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const CustomTabBar = (props) => {
    return (
        <View>
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 30,
                    backgroundColor: COLORS.white,
                }}
            ></View>
            <BottomTabBar {...props.props} />
        </View>
    );
};

const TabBarCustomButton = ({
    accessibilityState,
    children,
    onPress,
    onCustomPress = () => {},
}) => {
    var isSelected = accessibilityState.selected;

    if (isSelected) {
        return (
            <View style={{ flex: 1, alignItems: "center" }}>
                <View
                    style={{
                        flexDirection: "row",
                        position: "absolute",
                        top: 0,
                    }}
                >
                    <View
                        style={{ flex: 1, backgroundColor: COLORS.white }}
                    ></View>

                    <Svg width={75} height={61} viewBox="0 0 75 61">
                        <Path
                            d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                            fill={COLORS.white}
                        />
                    </Svg>

                    <View
                        style={{ flex: 1, backgroundColor: COLORS.white }}
                    ></View>
                </View>

                <TouchableOpacity
                    style={{
                        top: -22.5,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: COLORS.primary,
                        ...STYLES.shadow,
                    }}
                    onPress={() => {
                        onPress();
                    }}
                >
                    {children}
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 50,
                    height: 50,
                    backgroundColor: COLORS.white,
                }}
                activeOpacity={1}
                onPress={() => {
                    onPress();
                    onCustomPress();
                }}
            >
                {children}
            </TouchableOpacity>
        );
    }
};
export default AppNavigator;
