import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AIAssistantPanel from './AIAssistantPanel';

interface Props {
  context: string;
  label?: string;
}

export default function AssistantFab({ context, label = 'AI' }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.fabIcon}>✦</Text>
        <Text style={styles.fabText}>{label}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assistant</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            <AIAssistantPanel context={context} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 92,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#0B1120',
  },
  fabIcon: {
    color: '#F9FAFB',
    fontSize: 14,
    marginRight: 8,
  },
  fabText: {
    color: '#F9FAFB',
    fontSize: 12,
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0B1120',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '800',
  },
  closeText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '700',
  },
});

