import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';
import { sampleTasks } from '../data/sampleTasks';
import { colors } from '../theme/colors';

const filters = [
  { key: 'All', label: 'All tasks' },
  { key: 'Pending', label: 'To do' },
  { key: 'Completed', label: 'Done' },
];
const dueOptions = ['Today', 'Tomorrow', 'This week', 'Anytime'];
const priorityOptions = ['Low', 'Medium', 'High'];

function ChoiceGroup({ title, options, selected, onSelect }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{title}</Text>
      <View style={styles.choiceRow}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.choice, selected === option && styles.choiceActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === option }}
          >
            <Text style={[styles.choiceText, selected === option && styles.choiceTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState(sampleTasks);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [due, setDue] = useState('Today');
  const [priority, setPriority] = useState('Medium');
  const [note, setNote] = useState('');

  const finished = tasks.filter((task) => task.completed).length;
  const percent = tasks.length ? Math.round((finished / tasks.length) * 100) : 0;
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = filter === 'All' ||
        (filter === 'Completed' ? task.completed : !task.completed);
      const matchesSearch = !query ||
        `${task.title} ${task.subject} ${task.note}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [tasks, search, filter]);

  function toggleComplete(id) {
    setTasks((oldTasks) => oldTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  function resetForm() {
    setTitle('');
    setSubject('');
    setDue('Today');
    setPriority('Medium');
    setNote('');
  }

  function addTask() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: cleanTitle,
      subject: subject.trim() || 'General',
      due,
      priority,
      note: note.trim(),
      completed: false,
    };
    setTasks((oldTasks) => [newTask, ...oldTasks]);
    setFilter('All');
    setSearch('');
    resetForm();
    Keyboard.dismiss();
    setShowAdd(false);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>YOUR DAILY PLAN</Text>
            <Text style={styles.heading}>My Tasks</Text>
            <Text style={styles.subheading}>One thing at a time. You can do this! 💙</Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => setShowAdd(true)}
            accessibilityRole="button"
            accessibilityLabel="Add a new task"
          >
            <Ionicons name="add" size={26} color={colors.background} />
          </Pressable>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressTitle}>Look how far you've come</Text>
              <Text style={styles.progressSubtitle}>{finished} of {tasks.length} tasks completed</Text>
            </View>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find a task or subject..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search tasks"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={19} color={colors.muted} />
            </Pressable>
          )}
        </View>

        <View style={styles.filterRow}>
          {filters.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.filterChip, filter === item.key && styles.filterActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === item.key }}
            >
              <Text style={[styles.filterText, filter === item.key && styles.filterActiveText]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.listTitleRow}>
          <Text style={styles.listTitle}>Your list</Text>
          <Text style={styles.listCount}>{visibleTasks.length} shown</Text>
        </View>

        {visibleTasks.length ? (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={setSelectedTaskId}
              onToggle={toggleComplete}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles-outline" size={32} color={colors.primary} />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>
              {search || filter !== 'All'
                ? 'Try another search or choose a different filter.'
                : 'Add one small task to begin your day.'}
            </Text>
          </View>
        )}
        <Text style={styles.demoNote}>
          Practice mode: changes stay while the app is open. Permanent offline saving comes next.
        </Text>
      </ScrollView>

      <Modal
        visible={showAdd}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAdd(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBack}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalPanel}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>Add a little goal for today</Text>
                <Text style={styles.modalHint}>Keep it simple. Start small.</Text>
              </View>
              <Pressable onPress={() => { Keyboard.dismiss(); setShowAdd(false); }} accessibilityLabel="Close add task">
                <Ionicons name="close-circle-outline" size={27} color={colors.muted} />
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Task name *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Revise lecture notes"
                placeholderTextColor={colors.muted}
                maxLength={90}
              />
              <Text style={styles.fieldLabel}>Subject (optional)</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Computer Security"
                placeholderTextColor={colors.muted}
                maxLength={50}
              />
              <ChoiceGroup title="When?" options={dueOptions} selected={due} onSelect={setDue} />
              <ChoiceGroup title="Priority" options={priorityOptions} selected={priority} onSelect={setPriority} />
              <Text style={styles.fieldLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                multiline
                value={note}
                onChangeText={setNote}
                placeholder="Anything to remember?"
                placeholderTextColor={colors.muted}
                maxLength={200}
              />
              <Pressable
                style={[styles.saveButton, !title.trim() && styles.disabledButton]}
                disabled={!title.trim()}
                onPress={addTask}
                accessibilityRole="button"
              >
                <Text style={styles.saveText}>Save task</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={Boolean(selectedTask)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTaskId(null)}
      >
        <View style={styles.detailBack}>
          <View style={styles.detailPanel}>
            <View style={styles.modalHeader}>
              <Text style={styles.detailTag}>TASK DETAILS</Text>
              <Pressable onPress={() => setSelectedTaskId(null)} accessibilityLabel="Close task details">
                <Ionicons name="close-circle-outline" size={27} color={colors.muted} />
              </Pressable>
            </View>
            {selectedTask && (
              <>
                <Text style={styles.detailTitle}>{selectedTask.title}</Text>
                <Text style={styles.detailSubject}>{selectedTask.subject}</Text>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>When</Text>
                  <Text style={styles.detailValue}>{selectedTask.due}</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Priority</Text>
                  <Text style={styles.detailValue}>{selectedTask.priority}</Text>
                </View>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailNotes}>{selectedTask.note || 'No notes added.'}</Text>
                <Pressable style={styles.saveButton} onPress={() => toggleComplete(selectedTask.id)}>
                  <Text style={styles.saveText}>
                    {selectedTask.completed ? 'Mark as to do' : 'Mark as completed'}
                  </Text>
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
  headerText: { flex: 1, paddingRight: 12 },
  eyebrow: { color: colors.mint, fontSize: 11, letterSpacing: 1.8, fontWeight: '800', marginBottom: 8 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subheading: { color: colors.muted, fontSize: 13, marginTop: 7, lineHeight: 19 },
  addButton: {
    width: 52, height: 52, borderRadius: 17, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  progressCard: { backgroundColor: colors.raised, padding: 19, borderRadius: 20, marginBottom: 21 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  progressTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  progressSubtitle: { color: colors.muted, fontSize: 12, marginTop: 6 },
  progressPercent: { color: colors.mint, fontWeight: '800', fontSize: 25 },
  track: { height: 8, borderRadius: 8, backgroundColor: colors.border, overflow: 'hidden', marginTop: 17 },
  fill: { height: 8, borderRadius: 8, backgroundColor: colors.mint },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 15, paddingHorizontal: 15, height: 51, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingHorizontal: 11, paddingVertical: 8 },
  filterRow: { flexDirection: 'row', gap: 9, marginVertical: 17, flexWrap: 'wrap' },
  filterChip: {
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    borderRadius: 100, paddingHorizontal: 15, paddingVertical: 10,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.muted, fontWeight: '700', fontSize: 12 },
  filterActiveText: { color: colors.background },
  listTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  listTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  listCount: { color: colors.muted, fontSize: 12 },
  emptyCard: { padding: 30, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center' },
  emptyTitle: { fontSize: 17, color: colors.text, fontWeight: '800', marginTop: 12 },
  emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 21, marginTop: 9 },
  demoNote: { color: colors.muted, textAlign: 'center', fontSize: 11, lineHeight: 18, marginTop: 18 },
  modalBack: { flex: 1, backgroundColor: 'rgba(0,5,13,0.78)', justifyContent: 'flex-end' },
  modalPanel: {
    backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 23,
    paddingBottom: 30, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '91%', borderColor: colors.border, borderWidth: 1,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  modalHeaderText: { flex: 1, paddingRight: 12 },
  modalTitle: { color: colors.text, fontSize: 21, fontWeight: '800', lineHeight: 28 },
  modalHint: { color: colors.muted, marginTop: 5, fontSize: 13 },
  fieldLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 9 },
  input: {
    borderColor: colors.border, borderWidth: 1, borderRadius: 14, backgroundColor: colors.surface,
    color: colors.text, padding: 14, fontSize: 14, marginBottom: 19,
  },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  fieldBlock: { marginBottom: 17 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 100, paddingVertical: 9, paddingHorizontal: 13,
  },
  choiceActive: { borderColor: colors.primary, backgroundColor: colors.raised },
  choiceText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  choiceTextActive: { color: colors.primary },
  saveButton: { backgroundColor: colors.primary, borderRadius: 15, padding: 16, alignItems: 'center', marginTop: 8 },
  disabledButton: { opacity: 0.45 },
  saveText: { color: colors.background, fontSize: 15, fontWeight: '800' },
  detailBack: { flex: 1, justifyContent: 'center', padding: 18, backgroundColor: 'rgba(0,5,13,0.8)' },
  detailPanel: { backgroundColor: colors.surface, borderRadius: 24, padding: 23, borderWidth: 1, borderColor: colors.border },
  detailTag: { color: colors.mint, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  detailTitle: { color: colors.text, fontWeight: '800', fontSize: 22, lineHeight: 29 },
  detailSubject: { color: colors.primary, fontSize: 13, marginTop: 8, marginBottom: 20 },
  detailInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { color: colors.muted, fontSize: 13, marginTop: 11 },
  detailValue: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 11 },
  detailNotes: { color: colors.text, fontSize: 14, lineHeight: 21, marginTop: 9, marginBottom: 21 },
});
