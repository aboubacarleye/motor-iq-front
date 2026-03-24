import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';
import { ExtendedClaim } from '../stores/claimsStore';

interface Props {
  claim: ExtendedClaim;
  onPress?: () => void;
}

export default function ClaimCard({ claim, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{claim.description}</Text>
        <Text style={styles.status}>{claim.status}</Text>
      </View>
      <Text style={styles.metaText}>{claim.vehicleName}</Text>
      <Text style={styles.metaText}>Submitted {claim.submissionDate}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

