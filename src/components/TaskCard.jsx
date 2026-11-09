import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const priorityColors = {
  High: '#FFAEAE',
  Medium: '#FFD48A',
  Low: colors.mint,
};

export default function TaskCard({ task, onOpen, onToggle }) {
  const priorityColor = priorityColors[task.priority] ?? colors.mint;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onOpen(task.id)}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${task.title}`}
    >
      <View style={styles.mainRow}>
        <Pressable
          onPress={() => onToggle(task.id)}
          style={styles.checkArea}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          accessibilityLabel={`Mark ${task.title} ${task.completed ? 'incomplete' : 'complete'}`}
        >
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={27}
            color={task.completed ? colors.mint : colors.primary}
          />
        </Pressable>

        <View style={styles.textArea}>
          <Text style={styles.subject} numberOfLines={1}>{task.subject}</Text>
          <Text style={[styles.title, task.completed && styles.doneTitle]} numberOfLines={2}>
            {task.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.muted} />
          <Text style={styles.metaText}>{task.due}</Text>
        </View>
        <View style={[styles.priorityPill, { borderColor: priorityColor + '55' }]}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority}</Text>
        </View>
        {task.completed && <Text style={styles.completedText}>Completed</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  pressed: { opacity: 0.85 },
  mainRow: { flexDirection: 'row', alignItems: 'center' },
  checkArea: { paddingRight: 12, paddingVertical: 9 },
  textArea: { flex: 1, marginRight: 8 },
  subject: { color: colors.primary, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', lineHeight: 22 },
  doneTitle: { color: colors.muted, textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 13, gap: 10, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: colors.muted, fontSize: 12 },
  priorityPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, paddingVertical: 5, paddingHorizontal: 9, borderRadius: 100,
  },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  completedText: { color: colors.mint, fontSize: 11, fontWeight: '700' },
});
