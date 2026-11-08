import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function IntroScreen({ navigation, icon, title, message, nextFeature }) {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={32} color={colors.primary} />
        </View>
        <Text style={styles.kicker}>YOUR LEARNOVA SPACE</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.card}>
          <Ionicons name="sparkles-outline" size={22} color={colors.mint} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardHeading}>Coming in our next steps</Text>
            <Text style={styles.cardText}>{nextFeature}</Text>
          </View>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Back to Home</Text>
          <Ionicons name="arrow-forward" color={colors.background} size={18} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  iconBox: {
    backgroundColor: colors.raised, width: 74, height: 74,
    borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  kicker: { color: colors.mint, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: 14 },
  message: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  card: {
    marginTop: 30, flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: colors.surface, padding: 18, borderRadius: 18,
    borderWidth: 1, borderColor: colors.border,
  },
  cardHeading: { color: colors.text, fontWeight: '700', fontSize: 14, marginBottom: 5 },
  cardText: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  button: {
    backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, borderRadius: 15, padding: 16, marginTop: 30,
  },
  buttonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
});
