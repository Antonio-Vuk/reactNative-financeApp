import React from "react";
import {
    TransactionsScreen,
    TransactionDetailScreen,
    TransactionScreen,
    CategoryScreen,
    CustomFieldSettingsScreen,
    CreateCustomFieldScreen,
    WalletScreen,
} from "../screens";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "./routes";
const Stack = createStackNavigator();

const TransactionNavigator = (props) => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen
                name={routes.transactions}
                component={TransactionsScreen}
            ></Stack.Screen>
            <Stack.Screen
                name={routes.transaction}
                component={TransactionDetailScreen}
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
            <Stack.Screen
                name={routes.wallet}
                component={WalletScreen}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};

export default TransactionNavigator;
