import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const shortcuts = [
  { label: 'My Tasks', hint: 'Plan your day', icon: 'checkbox-outline', route: 'Tasks' },
  { label: 'My Goals', hint: 'Dream a little bigger', icon: 'flag-outline', route: 'Goals' },
  { label: 'Focus Time', hint: 'Make time for you', icon: 'timer-outline', route: 'Focus' },
  { label: 'Progress', hint: 'See how far you go', icon: 'bar-chart-outline', route: 'Progress' },
];

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>LEARNOVA</Text>
            <Text style={styles.greeting}>Hey there! 👋</Text>
            <Text style={styles.subGreeting}>Ready for a fresh start?</Text>
          </View>
          <View style={styles.logo}>
            <Ionicons name="school-outline" size={28} color={colors.primary} />
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroKicker}>A GENTLE REMINDER</Text>
          <Text style={styles.heroTitle}>You don't have to do it all today.</Text>
          <Text style={styles.heroSubtitle}>Just start with one small step. 💙</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Tasks')}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Plan my day</Text>
            <Ionicons name="arrow-forward" size={19} color={colors.background} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Your space</Text>
        <Text style={styles.sectionSubtitle}>What would you like to do?</Text>
        <View style={styles.grid}>
          {shortcuts.map((item) => (
            <Pressable
              key={item.route}
              style={styles.tile}
              onPress={() => navigation.navigate(item.route)}
              accessibilityRole="button"
            >
              <Ionicons name={item.icon} size={24} color={colors.mint} />
              <Text style={styles.tileTitle}>{item.label}</Text>
              <Text style={styles.tileSubtitle}>{item.hint}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.note}>
          Your tasks, goals, and study records will appear here once we add offline storage.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 36 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  brand: { color: colors.primary, letterSpacing: 2.5, fontWeight: '800', fontSize: 11, marginBottom: 10 },
  greeting: { color: colors.text, fontSize: 29, fontWeight: '800' },
  subGreeting: { color: colors.muted, fontSize: 15, marginTop: 5 },
  logo: {
    width: 54, height: 54, borderRadius: 18, backgroundColor: colors.raised,
    alignItems: 'center', justifyContent: 'center',
  },
  hero: { backgroundColor: colors.raised, borderRadius: 26, padding: 24, marginBottom: 30 },
  heroKicker: { color: colors.mint, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  heroTitle: { color: colors.text, fontSize: 25, fontWeight: '800', lineHeight: 32, marginBottom: 12 },
  heroSubtitle: { color: colors.muted, fontSize: 15, marginBottom: 24 },
  primaryButton: {
    backgroundColor: colors.primary, borderRadius: 15, paddingVertical: 15,
    paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9,
  },
  primaryButtonText: { color: colors.background, fontWeight: '800', fontSize: 15 },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  sectionSubtitle: { color: colors.muted, fontSize: 14, marginTop: 6, marginBottom: 17 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  tile: {
    width: '48%', minHeight: 150, backgroundColor: colors.surface,
    borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 18,
  },
  tileTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 18 },
  tileSubtitle: { color: colors.muted, fontSize: 12, marginTop: 5, lineHeight: 18 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 24, textAlign: 'center' },
});
