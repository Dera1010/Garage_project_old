import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    containerStyle?: ViewStyle | ViewStyle[];
    gradientColors?: [string, string, ...string[]];
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    containerStyle,
    gradientColors = ["#F4F7FB", "#FFFFFF"],
}) => {
    return (
        <View style={[styles.outerContainer, containerStyle]}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.container, style]}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        // Shadow for iOS
        shadowColor: "rgba(133, 189, 215, 0.88)",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        // Shadow for Android
        elevation: 8,
        margin: 10,
        alignSelf: "stretch",
    },
    container: {
        borderRadius: 30,
        padding: 20,
        borderWidth: 3,
        borderColor: "#FFFFFF",
        backgroundColor: "#F8F9FD",
        overflow: "hidden",
    },
});
