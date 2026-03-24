import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native-web';
import { useLocation } from 'wouter';
import useClaimsStore from '../stores/claimsStore';
import PolicyCard from '../components/PolicyCard';
import ClaimCard from '../components/ClaimCard';
import TimelineProgress from '../components/TimelineProgress';

export default function DashboardScreen() {
  const [, setLocation] = useLocation();
  const profile = useClaimsStore((state) => state.profile);
  const claims = useClaimsStore((state) => state.claims);
  const theme = useClaimsStore((state) => state.theme);
  const isDark = theme === 'dark';
  const [selectedClaim, setSelectedClaim] = React.useState<
    ReturnType<typeof useClaimsStore>['claims'][number] | null
  >(null);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>MotorIQ</Text>
            <Text style={styles.welcomeText}>Welcome back, {profile.name}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.avatarInitials ?? 'DR'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setLocation('/app/report')}>
          <Text style={styles.primaryButtonText}>Report an Incident</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.magicButton}
          activeOpacity={0.95}
          onPress={() => setLocation('/app/assistant')}
        >
          <Text style={styles.magicButtonTitle}>Have an accident?</Text>
          <Text style={styles.magicButtonSubtitle}>Chat with our agent to guide you</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Policy</Text>
          <PolicyCard policy={profile.policy} />
          <TouchableOpacity style={styles.upgradeBanner} activeOpacity={0.9} onPress={() => setLocation('/app/upgrade')}>
            <Text style={styles.upgradeTitle}>Upgrade your coverage</Text>
            <Text style={styles.upgradeSubtitle}>
              Get enhanced protection, roadside assistance and faster claim processing.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Claims</Text>
            <Text style={styles.linkText}>History</Text>
          </View>
          {claims.slice(0, 3).map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onPress={() => setSelectedClaim(claim)}
            />
          ))}
        </View>
      </ScrollView>

      {selectedClaim && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
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
            <View style={{ marginTop: 16 }}>
              <Text style={styles.timelineTitle}>Claim progress</Text>
              <TimelineProgress steps={selectedClaim.timeline} />
            </View>
          </View>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B1020',
  },
  welcomeText: {
    fontSize: 14,
    color: '#8F9BB3',
    marginTop: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  magicButton: {
    backgroundColor: '#0B1120',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#111827',
  },
  magicButtonTitle: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  magicButtonSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    color: '#4B5563',
  },
  claimCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  claimLeft: {
    marginRight: 12,
  },
  claimIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  claimMiddle: {
    flex: 1,
  },
  claimTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  claimSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  claimStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  claimRight: {
    marginLeft: 8,
  },
  claimDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  upgradeBanner: {
    marginTop: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
  },
  upgradeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: '#4B5563',
  },
  modalBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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