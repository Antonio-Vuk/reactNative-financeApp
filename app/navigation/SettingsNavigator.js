import React from "react";

import {
    SettingsScreen,
    CategoryesScreen,
    WalletsScreen,
    CategoryScreen,
    WalletScreen,
    TestScreen,
    CustomFieldSettingsScreen,
    CreateCustomFieldScreen,
    RegisterScreen,
} from "../screens";
import routes from "./routes";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const SettingsNavigator = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name={routes.settings} component={SettingsScreen} />
            <Stack.Screen
                name={routes.categories}
                component={CategoryesScreen}
            />
            <Stack.Screen name={routes.wallets} component={WalletsScreen} />
            <Stack.Screen
                name={routes.category}
                component={CategoryScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.wallet}
                component={WalletScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.test}
                component={TestScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.customFields}
                component={CustomFieldSettingsScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.createCustomField}
                component={CreateCustomFieldScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.register}
                component={RegisterScreen}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};

export default SettingsNavigator;
