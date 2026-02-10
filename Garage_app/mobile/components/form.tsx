import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";
import { Loader } from "./loader";
import { Card } from "./card";
import { Button } from "./button";

interface FormProps {
    title: string;
    buttonTitle: string;
    loading?: boolean;
    onSubmit: () => void;
    children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({
    title,
    buttonTitle,
    loading = false,
    onSubmit,
    children,
}) => {
    return (
        <Card style={styles.formCard}>
            <Text style={styles.heading}>{title}</Text>

            <View style={styles.formContainer}>
                {children}

                {loading ? (
                    <View style={{ marginTop: 20 }}>
                        <Loader />
                    </View>
                ) : (
                    <Button
                        title={buttonTitle}
                        onPress={onSubmit}
                    />
                )}
            </View>
        </Card>
    );
};

export const FormInput = (props: React.ComponentProps<typeof TextInput>) => (
    <TextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor="#AAAAAA"
    />
);

const styles = StyleSheet.create({
    formCard: {
        paddingTop: 10,
        alignSelf: "center",
        maxWidth: 350,
        width: "100%",
    },
    formContainer: {
        marginTop: 10,
    },
    heading: {
        textAlign: "center",
        fontWeight: "900",
        fontSize: 30,
        color: "#1089D3",
    },
    input: {
        width: "100%",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 20,
        marginTop: 15,
        shadowColor: "#cff0ff",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
        fontSize: 14,
        color: "#333",
    },
});
