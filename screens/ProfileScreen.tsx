import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import useClaimsStore from '../stores/claimsStore';

export default function ProfileScreen() {
  const profile = useClaimsStore((state) => state.profile);
  const updateProfile = useClaimsStore((state) => state.updateProfile);
  const theme = useClaimsStore((state) => state.theme);
  const toggleTheme = useClaimsStore((state) => state.toggleTheme);
  const navigation = useNavigation();

  return (
    <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Driver Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeRow}>
            <Text style={styles.label}>Theme</Text>
            <TouchableOpacity
              style={styles.themeToggle}
              activeOpacity={0.9}
              onPress={toggleTheme}
            >
              <Text style={styles.themeToggleText}>
                {theme === 'light' ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal details</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => updateProfile({ name: text })}
          />
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(text) => updateProfile({ phone: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicles</Text>
          {profile.vehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleCard}>
              <Text style={styles.vehicleTitle}>
                {vehicle.make} {vehicle.model}
              </Text>
              <Text style={styles.vehicleMeta}>Plate: {vehicle.license_plate}</Text>
              <Text style={styles.vehicleMeta}>Year: {vehicle.year}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policy</Text>
          <View style={styles.policyCard}>
            <Text style={styles.policyName}>{profile.policy.name}</Text>
            <Text style={styles.policyMeta}>Policy No: {profile.policy.policyNumber}</Text>
            <Text style={styles.policyMeta}>Coverage: {profile.policy.coverageLimit}</Text>
            <Text style={styles.policyMeta}>Renews: {profile.policy.renewalDate}</Text>
          </View>
          <TouchableOpacity
            style={styles.upgradeCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('UpgradeInsurance' as never)}
          >
            <Text style={styles.upgradeTitle}>Upgrade my insurance</Text>
            <Text style={styles.upgradeText}>
              Explore higher coverage limits and additional benefits tailored to your driving.
            </Text>
          </TouchableOpacity>
        </View>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  vehicleMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  policyCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
  },
  policyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  policyMeta: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 2,
  },
  upgradeCard: {
    marginTop: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
  },
  upgradeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 12,
    color: '#4B5563',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeToggle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  themeToggleText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});
