import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  addReminder,
  removeReminder,
  updateReminder,
} from '../store/slices/reminderSlice';
import {
  scheduleNotification,
  cancelNotification,
  createChannel,
} from '../utils/notification';
import uuid from 'react-native-uuid';
import ReminderCard from '../components/ReminderCard';
import { Reminder } from '../utils/types';

const ReminderScreen = () => {
  const reminders = useSelector((state: RootState) => state.reminders.items);
  const dispatch = useDispatch();

  const [label, setLabel] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    createChannel();
  }, []);

  const addOrUpdateReminder = async () => {
    if (!label || !time) {
      setError('Lütfen saat ve etiket giriniz.');
      return;
    }
    setError('');
    const now = new Date();
    const [hour, minute] = time.split(':').map(Number);
    const reminderDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
    );
    if (reminderDate < now) reminderDate.setDate(reminderDate.getDate() + 1);
    if (editId) {
      dispatch(updateReminder({ id: editId, time, label }));
      await cancelNotification(editId);
      await scheduleNotification(
        editId,
        'Diyet Hatırlatıcı',
        `${label} zamanı geldi!`,
        reminderDate,
      );
      setEditId(null);
    } else {
      const id = uuid.v4().toString();
      const newReminder: Reminder = {
        id,
        time: time,
        label,
      };
      dispatch(addReminder(newReminder));
      await scheduleNotification(
        id,
        'Diyet Hatırlatıcı',
        `${label} zamanı geldi!`,
        reminderDate,
      );
    }
    setLabel('');
    setTime('');
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditId(reminder.id);
    setLabel(reminder.label);
    setTime(reminder.time);
  };

  const removeExistingReminder = async (id: string) => {
    dispatch(removeReminder(id));
    await cancelNotification(id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Etiket (örn: Kahvaltı)"
          value={label}
          onChangeText={setLabel}
        />
        <TextInput
          style={styles.input}
          placeholder="Saat (örn: 08:30)"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
          maxLength={5}
        />
        <Button
          title={editId ? 'Güncelle' : 'Ekle'}
          onPress={addOrUpdateReminder}
          color="#1a3c6e"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        style={{ marginTop: 20 }}
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReminderCard
            label={item.label}
            time={item.time}
            onDelete={() => removeExistingReminder(item.id)}
            onEdit={() => handleEditReminder(item)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 4,
  },
  error: {
    color: '#ff3b30',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default ReminderScreen;
