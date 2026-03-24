import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { PolicySummary } from '../stores/claimsStore';

interface Props {
  policy: PolicySummary;
}

export default function PolicyCard({ policy }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>ACTIVE</Text>
        </View>
        <Text style={styles.manageText}>Manage</Text>
      </View>
      <Text style={styles.title}>{policy.name}</Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Policy Number</Text>
          <Text style={styles.value}>{policy.policyNumber}</Text>
        </View>
        <View>
          <Text style={styles.label}>Coverage Limit</Text>
          <Text style={styles.value}>{policy.coverageLimit}</Text>
        </View>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Renews {policy.renewalDate}</Text>
        <Text style={styles.linkText}>View Policy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  manageText: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 11,
    marginBottom: 2,
  },
  value: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  linkText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
});

