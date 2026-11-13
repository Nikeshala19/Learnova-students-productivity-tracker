import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import GoalCard from '../components/GoalCard';
import { deleteGoal, getGoals, insertGoal, updateGoalStatus } from '../database/database';
import { colors } from '../theme/colors';

const filters = [
  { key: 'All', label: 'All goals' },
  { key: 'Active', label: 'In progress' },
  { key: 'Achieved', label: 'Achieved' },
];
const categories = ['Academics', 'Skills', 'Personal'];

export default function GoalsScreen() {
  const db = useSQLiteContext();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academics');
  const [note, setNote] = useState('');

  const achievedCount = goals.filter((item) => item.achieved).length;
  const percentage = goals.length ? Math.round((achievedCount / goals.length) * 100) : 0;
  const selected = goals.find((goal) => goal.id === selectedId);
  const visibleGoals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return goals.filter((goal) => {
      const statusMatches = filter === 'All' ||
        (filter === 'Achieved' ? goal.achieved : !goal.achieved);
      const textMatches = !q ||
        `${goal.title} ${goal.category} ${goal.note}`.toLowerCase().includes(q);
      return statusMatches && textMatches;
    });
  }, [goals, filter, search]);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setErrorText('');
    try {
      setGoals(await getGoals(db));
    } catch (err) {
      console.error('Could not load goals', err);
      setErrorText('We could not load your goals. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  async function addGoal() {
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;
    const goal = {
      id: `goal-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      title: cleanTitle,
      category,
      note: note.trim(),
      achieved: false,
    };
    setSaving(true);
    try {
      await insertGoal(db, goal);
      setGoals((previous) => [goal, ...previous]);
      setTitle('');
      setNote('');
      setCategory('Academics');
      setSearch('');
      setFilter('All');
      Keyboard.dismiss();
      setShowAdd(false);
    } catch (err) {
      console.error('Could not save goal', err);
      Alert.alert('Goal not saved', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleAchieved() {
    if (!selected || busy.current) return;
    busy.current = true;
    const next = !selected.achieved;
    try {
      await updateGoalStatus(db, selected.id, next);
      setGoals((previous) => previous.map((goal) =>
        goal.id === selected.id ? { ...goal, achieved: next } : goal
      ));
    } catch (err) {
      console.error('Could not update goal', err);
      Alert.alert('Could not save', 'Your goal was not changed.');
    } finally {
      busy.current = false;
    }
  }

  function askToDelete() {
    if (!selected || busy.current) return;
    const id = selected.id;
    Alert.alert('Remove this goal?', 'This goal will be deleted from your device.', [
      { text: 'Keep goal', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          if (busy.current) return;
          busy.current = true;
          try {
            await deleteGoal(db, id);
            setGoals((previous) => previous.filter((goal) => goal.id !== id));
            setSelectedId(null);
          } catch (err) {
            console.error('Could not delete goal', err);
            Alert.alert('Could not delete', 'Please try again.');
          } finally {
            busy.current = false;
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>YOUR NEXT MILESTONE</Text>
            <Text style={styles.heading}>My Goals</Text>
            <Text style={styles.subtitle}>Big dreams begin with little steps. ✨</Text>
          </View>
          <Pressable
            accessibilityRole="button" accessibilityLabel="Add a goal"
            style={styles.plusButton} onPress={() => setShowAdd(true)}
          >
            <Ionicons name="add" color={colors.background} size={26} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Every milestone counts</Text>
              <Text style={styles.heroSub}>{achievedCount} of {goals.length} goals achieved</Text>
            </View>
            <Text style={styles.percent}>{percentage}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.encouragement}>
            {goals.length === 0 ? 'Your journey starts with one goal.' :
              percentage === 100 ? 'You did it! Time to celebrate your progress.' :
              'Keep showing up for yourself. You are growing.'}
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <TextInput
            accessibilityLabel="Search goals" style={styles.searchInput}
            placeholder="Search your goals..." placeholderTextColor={colors.muted}
            autoCapitalize="none" returnKeyType="search" value={search} onChangeText={setSearch}
          />
          {Boolean(search) && (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear goal search" onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
        <View style={styles.filterRow}>
          {filters.map((option) => (
            <Pressable
              key={option.key} onPress={() => setFilter(option.key)}
              accessibilityRole="button" accessibilityState={{ selected: filter === option.key }}
              style={[styles.filterChip, filter === option.key && styles.filterActive]}
            >
              <Text style={[styles.filterText, filter === option.key && styles.filterActiveText]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Your goals</Text>
          <Text style={styles.count}>{visibleGoals.length} shown</Text>
        </View>
        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.emptyText}>Loading your goals...</Text>
          </View>
        ) : errorText ? (
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={30} color={colors.primary} />
            <Text style={styles.emptyText}>{errorText}</Text>
            <Pressable onPress={loadGoals} style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : visibleGoals.length ? (
          visibleGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onOpen={setSelectedId} />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="flag-outline" size={34} color={colors.primary} />
            <Text style={styles.emptyTitle}>A fresh start</Text>
            <Text style={styles.emptyText}>
              {search || filter !== 'All' ? 'Try another search or filter.' :
                'Add a goal that matters to you. Start small!'}
            </Text>
          </View>
        )}
        <Text style={styles.storageNote}>Your goals are saved on this device, even offline.</Text>
      </ScrollView>

      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <KeyboardAvoidingView style={styles.backdropBottom} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.addPanel}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>A new goal to grow into</Text>
                <Text style={styles.modalHint}>What would you love to achieve?</Text>
              </View>
              <Pressable accessibilityLabel="Close add goal" onPress={() => { Keyboard.dismiss(); setShowAdd(false); }}>
                <Ionicons name="close-circle-outline" size={28} color={colors.muted} />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Goal title *</Text>
              <TextInput
                style={styles.input} value={title} onChangeText={setTitle}
                placeholder="e.g. Improve my programming skills" placeholderTextColor={colors.muted}
                maxLength={100} autoFocus={false}
              />
              <Text style={styles.fieldLabel}>Category</Text>
              <View style={styles.choiceRow}>
                {categories.map((option) => (
                  <Pressable
                    accessibilityRole="button" accessibilityState={{ selected: category === option }}
                    key={option} style={[styles.choice, category === option && styles.choiceSelected]}
                    onPress={() => setCategory(option)}
                  >
                    <Text style={[styles.choiceText, category === option && styles.choiceSelectedText]}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.fieldLabel}>A little reminder (optional)</Text>
              <TextInput
                style={[styles.input, styles.noteInput]} multiline value={note} onChangeText={setNote}
                placeholder="Why is this goal important to you?" placeholderTextColor={colors.muted}
                maxLength={240}
              />
              <Pressable
                accessibilityRole="button" onPress={addGoal} disabled={!title.trim() || saving}
                style={[styles.mainButton, (!title.trim() || saving) && { opacity: 0.45 }]}
              >
                <Text style={styles.mainButtonText}>{saving ? 'Saving...' : 'Save my goal'}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={() => setSelectedId(null)}>
        <View style={styles.backdropCenter}>
          <View style={styles.detailPanel}>
            <View style={styles.modalHeader}>
              <Text style={styles.detailEyebrow}>YOUR GOAL</Text>
              <Pressable accessibilityLabel="Close goal details" onPress={() => setSelectedId(null)}>
                <Ionicons name="close-circle-outline" size={28} color={colors.muted} />
              </Pressable>
            </View>
            {selected && (
              <>
                <Text style={styles.detailTitle}>{selected.title}</Text>
                <Text style={styles.detailCategory}>{selected.category}</Text>
                <View style={styles.detailLine}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[styles.detailValue, selected.achieved && { color: colors.mint }]}>
                    {selected.achieved ? 'Achieved' : 'In progress'}
                  </Text>
                </View>
                <Text style={styles.detailLabel}>Your reminder</Text>
                <Text style={styles.detailNote}>{selected.note || 'No reminder added yet.'}</Text>
                <Pressable onPress={toggleAchieved} style={styles.mainButton} accessibilityRole="button">
                  <Text style={styles.mainButtonText}>
                    {selected.achieved ? 'Mark as in progress' : 'I achieved this goal!'}
                  </Text>
                </Pressable>
                <Pressable onPress={askToDelete} style={styles.deleteButton} accessibilityRole="button">
                  <Text style={styles.deleteText}>Delete goal</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 23, paddingBottom: 35 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 21 },
  headerCopy: { flex: 1, paddingRight: 10 },
  eyebrow: { color: colors.mint, fontWeight: '800', letterSpacing: 1.7, fontSize: 11, marginBottom: 8 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  plusButton: { width: 52, height: 52, backgroundColor: colors.primary, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  hero: { backgroundColor: colors.raised, borderRadius: 20, padding: 19, marginBottom: 21 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  heroSub: { color: colors.muted, fontSize: 12, marginTop: 6 },
  percent: { color: colors.mint, fontWeight: '800', fontSize: 25 },
  progressTrack: { height: 8, backgroundColor: colors.border, borderRadius: 8, overflow: 'hidden', marginTop: 17 },
  progressFill: { height: 8, backgroundColor: colors.mint, borderRadius: 8 },
  encouragement: { color: colors.muted, fontSize: 12, marginTop: 12, lineHeight: 18 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, height: 51, borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, paddingHorizontal: 11, paddingVertical: 8, color: colors.text, fontSize: 14 },
  filterRow: { flexDirection: 'row', gap: 9, flexWrap: 'wrap', marginVertical: 17 },
  filterChip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 40, paddingVertical: 10, paddingHorizontal: 14 },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.muted, fontWeight: '700', fontSize: 12 },
  filterActiveText: { color: colors.background },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  count: { color: colors.muted, fontSize: 12 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 30, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontWeight: '800', fontSize: 17, marginTop: 12 },
  emptyText: { color: colors.muted, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  retryButton: { marginTop: 16, padding: 11, borderRadius: 10, backgroundColor: colors.raised },
  retryText: { color: colors.primary, fontWeight: '700' },
  storageNote: { textAlign: 'center', color: colors.muted, fontSize: 11, marginTop: 18, lineHeight: 18 },
  backdropBottom: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,5,13,0.78)' },
  addPanel: { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '91%', paddingHorizontal: 20, paddingTop: 23, paddingBottom: 30, borderWidth: 1, borderColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 10 },
  modalTitle: { color: colors.text, fontWeight: '800', fontSize: 21, lineHeight: 28 },
  modalHint: { color: colors.muted, marginTop: 5, fontSize: 13 },
  fieldLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 9 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, color: colors.text, fontSize: 14, padding: 14, marginBottom: 20 },
  noteInput: { minHeight: 83, textAlignVertical: 'top' },
  choiceRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 21 },
  choice: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 40, paddingVertical: 10, paddingHorizontal: 14 },
  choiceSelected: { backgroundColor: colors.raised, borderColor: colors.primary },
  choiceText: { fontWeight: '700', color: colors.muted, fontSize: 12 },
  choiceSelectedText: { color: colors.primary },
  mainButton: { backgroundColor: colors.primary, padding: 16, alignItems: 'center', borderRadius: 15, marginTop: 10 },
  mainButtonText: { color: colors.background, fontSize: 15, fontWeight: '800' },
  backdropCenter: { flex: 1, backgroundColor: 'rgba(0,5,13,0.8)', paddingHorizontal: 18, justifyContent: 'center' },
  detailPanel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 23 },
  detailEyebrow: { color: colors.mint, fontWeight: '800', fontSize: 11, letterSpacing: 2 },
  detailTitle: { color: colors.text, fontWeight: '800', fontSize: 22, lineHeight: 29 },
  detailCategory: { color: colors.primary, fontSize: 13, marginTop: 9, marginBottom: 19 },
  detailLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, marginBottom: 17 },
  detailLabel: { color: colors.muted, fontSize: 13 },
  detailValue: { color: colors.text, fontWeight: '700', fontSize: 13 },
  detailNote: { color: colors.text, lineHeight: 21, marginTop: 9, marginBottom: 11, fontSize: 14 },
  deleteButton: { marginTop: 10, padding: 12, alignItems: 'center' },
  deleteText: { color: '#FFB6B6', fontWeight: '700', fontSize: 13 },
});
