import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [message, setMessage] = useState(
    "One small step at a time."
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.logo}>
          <Text style={styles.logoText}>L</Text>
        </View>

        <Text style={styles.appName}>Learnova</Text>
        <Text style={styles.subtitle}>
          Your little space to grow.
        </Text>

        <View style={styles.card}>
          <Text style={styles.welcome}>
            Welcome to Learnova!
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() =>
              setMessage("You've got this! 💙")
            }
          >
            <Text style={styles.buttonText}>
              Let's Get Started
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Plan Smart. Study Better. Achieve More.
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#091827",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: "#183653",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  logoText: {
    color: "#73CBFF",
    fontSize: 40,
    fontWeight: "800",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    color: "#A6B9CD",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#13283F",
    width: "100%",
    padding: 24,
    borderRadius: 24,
    marginTop: 44,
    alignItems: "center",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  message: {
    color: "#B8C9D9",
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#55B9F3",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#091827",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    color: "#8298AD",
    fontSize: 12,
    marginTop: 38,
    textAlign: "center",
  },
});