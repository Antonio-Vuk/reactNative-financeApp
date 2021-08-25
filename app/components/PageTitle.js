import React from "react";
import { Text } from "react-native";
import { FONTS } from "../constants";

const PageTitle = ({ style, title }) => {
    return (
        <Text
            style={{
                ...FONTS.h1,
                ...style,
            }}
        >
            {title}
        </Text>
    );
};

export default PageTitle;
