import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    gradientColors?: [string, string, ...string[]];
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    gradientColors = ["#1089D3", "#12B1D1"],
    disabled = false,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
            style={[styles.container, style, disabled && { opacity: 0.6 }]}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 20,
        borderRadius: 20,
        // Shadow for iOS
        shadowColor: "rgba(133, 189, 215, 0.88)",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 10,
        // Shadow for Android
        elevation: 8,
    },
    gradient: {
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "bold",
        color: "white",
        fontSize: 16,
    },
});
