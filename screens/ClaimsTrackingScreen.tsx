import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native-web';
import useClaimsStore, { ExtendedClaim } from '../stores/claimsStore';
import TimelineProgress from '../components/TimelineProgress';

export default function ClaimsTrackingScreen() {
  const claims = useClaimsStore((state) => state.claims);
  const [selectedClaim, setSelectedClaim] = useState<ExtendedClaim | null>(null);
  const theme = useClaimsStore((state) => state.theme);
  const isDark = theme === 'dark';

  const renderItem = ({ item }: { item: ExtendedClaim }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedClaim(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.description}</Text>
        <Text style={styles.cardStatus}>{item.status}</Text>
      </View>
      <Text style={styles.metaLabel}>{item.vehicleName}</Text>
      <Text style={styles.metaValue}>Submitted {item.submissionDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={styles.title}>Claim Status</Text>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No claims yet. Start by reporting an incident.</Text>
        }
      />

      <Modal
        visible={!!selectedClaim}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedClaim(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedClaim && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedClaim.description}</Text>
                  <TouchableOpacity onPress={() => setSelectedClaim(null)}>
                    <Text style={styles.closeText}>Close</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalMeta}>
                  {selectedClaim.claimId} • {selectedClaim.vehicleName}
                </Text>
                <Text style={styles.modalMeta}>
                  Submitted {selectedClaim.submissionDate}
                </Text>
                <Text style={[styles.modalMeta, { marginTop: 8 }]}>
                  Status: {selectedClaim.status}
                </Text>
                <Text style={styles.modalMeta}>
                  Fraud risk score: {selectedClaim.fraud_risk_score}
                </Text>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.timelineTitle}>Claim progress</Text>
                  <TimelineProgress steps={selectedClaim.timeline} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  progressRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginRight: 4,
  },
  progressDotActive: {
    backgroundColor: '#2563EB',
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  closeText: {
    fontSize: 13,
    color: '#2563EB',
  },
  modalMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
});