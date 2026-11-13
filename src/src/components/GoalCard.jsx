import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const categoryIcons = {
  Academics: 'book-outline',
  Skills: 'sparkles-outline',
  Personal: 'heart-outline',
};

export default function GoalCard({ goal, onOpen }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View goal ${goal.title}`}
      onPress={() => onOpen(goal.id)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.row}>
        <View style={[styles.iconBox, goal.achieved && styles.achievedBox]}>
          <Ionicons
            name={goal.achieved ? 'checkmark-circle' : categoryIcons[goal.category] || 'flag-outline'}
            size={23}
            color={goal.achieved ? colors.mint : colors.primary}
          />
        </View>
        <View style={styles.main}>
          <Text style={styles.category}>{goal.category}</Text>
          <Text style={styles.title} numberOfLines={2}>{goal.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
      <View style={styles.footer}>
        <View style={[styles.status, goal.achieved && styles.completedStatus]}>
          <View style={[styles.dot, goal.achieved && styles.completedDot]} />
          <Text style={[styles.statusText, goal.achieved && styles.completedText]}>
            {goal.achieved ? 'Achieved' : 'In progress'}
          </Text>
        </View>
        <Text style={styles.tapHint}>Tap to view details</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { backgroundColor: colors.raised, height: 46, width: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  achievedBox: { backgroundColor: '#163D40' },
  main: { flex: 1 },
  category: { color: colors.primary, fontWeight: '700', fontSize: 11, marginBottom: 5 },
  title: { color: colors.text, fontWeight: '700', fontSize: 15, lineHeight: 21 },
  footer: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  status: { flexDirection: 'row', gap: 6, alignItems: 'center', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.raised },
  completedStatus: { backgroundColor: '#163D40' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  completedDot: { backgroundColor: colors.mint },
  statusText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  completedText: { color: colors.mint },
  tapHint: { color: colors.muted, fontSize: 11 },
});
