import React from "react";
import { TestScreen } from "../screens";
import routes from "./routes";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const TestingNavigator = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name={routes.test} component={TestScreen} />
        </Stack.Navigator>
    );
};

export default TestingNavigator;
