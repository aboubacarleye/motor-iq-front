import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import useClaimsStore from '../stores/claimsStore';

type Nav = StackNavigationProp<any>;

const COVERAGE_OPTIONS = [
  {
    id: 'standard',
    title: 'Standard',
    description: 'Current coverage with basic protection.',
    premium: '$55 / month',
  },
  {
    id: 'plus',
    title: 'Plus',
    description: 'Higher coverage limit and faster claims processing.',
    premium: '$72 / month',
    recommended: true,
  },
  {
    id: 'premium',
    title: 'Premium',
    description: 'Maximum coverage, roadside assistance and rental car.',
    premium: '$89 / month',
  },
];

export default function UpgradeInsuranceScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useClaimsStore((state) => state.profile);
  const updateProfile = useClaimsStore((state) => state.updateProfile);
  const theme = useClaimsStore((state) => state.theme);
  const [selectedId, setSelectedId] = useState<string>('plus');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    updateProfile({
      policy: {
        ...profile.policy,
        coverageLimit: '$75,000',
      },
    });
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade insurance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Choose a coverage plan</Text>
        <Text style={styles.subtitle}>
          Explore higher coverage limits and benefits tailored to how you drive.
        </Text>

        {COVERAGE_OPTIONS.map((option) => {
          const active = selectedId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, active && styles.optionCardActive]}
              onPress={() => setSelectedId(option.id)}
              activeOpacity={0.9}
            >
              <View style={styles.optionHeader}>
                <Text
                  style={[styles.optionTitle, active && styles.optionTitleActive]}
                >
                  {option.title}
                </Text>
                <Text
                  style={[styles.optionPrice, active && styles.optionPriceActive]}
                >
                  {option.premium}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionDescription,
                  active && styles.optionDescriptionActive,
                ]}
              >
                {option.description}
              </Text>
              {option.recommended && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Most popular</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.primaryButton, confirmed && styles.primaryButtonDisabled]}
          disabled={confirmed}
          onPress={handleConfirm}
        >
          <Text style={styles.primaryButtonText}>
            {confirmed ? 'Upgrade simulated' : 'Simulate upgrade'}
          </Text>
        </TouchableOpacity>

        {confirmed && (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Upgrade simulated</Text>
            <Text style={styles.confirmText}>
              Your policy preview has been updated to a higher coverage limit. This is a
              local simulation only.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  backText: {
    color: '#2563EB',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionCardActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  optionTitleActive: {
    color: '#FFFFFF',
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionPriceActive: {
    color: '#E5E7EB',
  },
  optionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  optionDescriptionActive: {
    color: '#E5E7EB',
  },
  tag: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#4B5563',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmCard: {
    marginTop: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
  },
  confirmTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  confirmText: {
    fontSize: 12,
    color: '#065F46',
  },
});

