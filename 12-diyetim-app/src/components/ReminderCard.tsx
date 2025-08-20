import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type ReminderCardProps = {
  time: string;
  label: string;
  onDelete: () => void;
  onEdit?: () => void;
};

const ReminderCard: React.FC<ReminderCardProps> = ({
  time,
  label,
  onDelete,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.time}>⏰ {time}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {onEdit && <Button title="Düzenle" color="#1a3c6e" onPress={onEdit} />}
        <Button title="Sil" color="#ff3b30" onPress={onDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    marginBottom: 8,
    color: '#333',
  },
});

export default ReminderCard;
