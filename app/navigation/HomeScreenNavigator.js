import React from "react";
import {
    WalletScreen,
    HomeScreen,
    TransactionScreen,
    CategoryScreen,
    CustomFieldSettingsScreen,
    CreateCustomFieldScreen,
} from "../screens";

import { createStackNavigator } from "@react-navigation/stack";
import routes from "./routes";
const Stack = createStackNavigator();

const HomeScreenNavigator = (props) => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen
                name={routes.home}
                component={HomeScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.wallet}
                component={WalletScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.editTransaction}
                component={TransactionScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.category}
                component={CategoryScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.customFields}
                component={CustomFieldSettingsScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.createCustomField}
                component={CreateCustomFieldScreen}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};

export default HomeScreenNavigator;
