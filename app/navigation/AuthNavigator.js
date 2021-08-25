import React from "react";
import { WelcomeScreen, LoginScreen, RegisterScreen } from "../screens";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "./routes";
const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name={routes.welcome} component={WelcomeScreen} />
            <Stack.Screen name={routes.login} component={LoginScreen} />
            <Stack.Screen name={routes.register} component={RegisterScreen} />
        </Stack.Navigator>
    );
};
export default AuthNavigator;
