import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator, AuthNavigator } from "./app/navigation";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { createTablesSQLite } from "./app/sqLite/SQLiteDB";
import { defaultState, saveDataLocalState } from "./app/store/state";
import { AppContext } from "./app/contexts";
import { loadStorageData } from "./app/storage";
import FlashMessage from "react-native-flash-message";
import { OnBoardingScreen } from "./app/screens";
import { getDataSQLite } from "./app/sqLite/sqliteFunctions";
import { constants } from "./app/constants";
import { ActivityIndicatorComponent } from "./app/components";
import { getDataRest } from "./app/rest/data";

const App = () => {
    const [state, setState] = useState(defaultState);

    const [loaded] = useFonts({
        "Roboto-Black": require("./app/assets/fonts/Roboto-Black.ttf"),
        "Roboto-Regular": require("./app/assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Bold": require("./app/assets/fonts/Roboto-Bold.ttf"),
    });
    useEffect(() => {
        LogBox.ignoreLogs([
            "VirtualizedLists should never be nested inside plain ScrollViews",
            "with the same orientation - use another VirtualizedList-backed container instead.",
            "Non-serializable values were found in the navigation state.",
        ]);
        createTablesSQLite();
    }, []);

    useEffect(() => {
        loadData(setState);
    }, []);

    if (!loaded) {
        return null;
    }
    return (
        <>
            <ActivityIndicatorComponent visible={state.loading} />
            {loaded && (
                <AppContext.Provider value={{ state, setState }}>
                    <NavigationContainer>
                        {state.onBoard != "true" && <OnBoardingScreen />}
                        {state.onBoard == "true" && (
                            <>
                                <FlashMessage position="top" />
                                {state.user != undefined && <AppNavigator />}
                                {state.user == undefined && <AuthNavigator />}
                            </>
                        )}
                    </NavigationContainer>
                </AppContext.Provider>
            )}
        </>
    );
};

const loadData = async (setState) => {
    await loadStorageData();

    if (defaultState.user == constants.offline) {
        await getDataSQLite();
    } else {
        if (defaultState.token != undefined && defaultState.token != "") {
            const result = await getDataRest();
            saveDataLocalState(result);
        }
    }
    setState({ ...defaultState });
};

export default App;
