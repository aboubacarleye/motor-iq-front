import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type Nav = StackNavigationProp<any>;

export default function WebLandingScreen() {
  const navigation = useNavigation<Nav>();

  const goToAdmin = () => {
    navigation.navigate('Admin' as never);
  };
  const goToDriver = () => {
    navigation.navigate('Main' as never);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.navbar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark} />
            <Text style={styles.brandText}>MotorIQ</Text>
          </View>
          <View style={styles.navRight}>
            <TouchableOpacity style={styles.navLink} onPress={goToDriver}>
              <Text style={styles.navLinkText}>Driver App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLink} onPress={goToAdmin}>
              <Text style={styles.navLinkText}>Admin Console</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navCta} onPress={goToAdmin}>
              <Text style={styles.navCtaText}>Enter Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Agentic claims experience • Demo</Text>
              </View>
              <Text style={styles.heroTitle}>
                AI agents built for modern motor insurance operations
              </Text>
              <Text style={styles.heroSubtitle}>
                A full interactive prototype: drivers report incidents with guided AI assistance,
                while admins review and prioritize claims in a web dashboard. No real login — all
                flows run with local mock data.
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={goToAdmin}>
                  <Text style={styles.primaryButtonText}>Enter admin console</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={goToDriver}>
                  <Text style={styles.secondaryButtonText}>Open driver app</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Triage</Text>
                  <Text style={styles.statLabel}>Prioritize claims by risk</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Evidence</Text>
                  <Text style={styles.statLabel}>Photos + voice note workflow</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>Prototype</Text>
                  <Text style={styles.statLabel}>All local & deployable as web</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroRight}>
              <View style={styles.mockPanel}>
                <Text style={styles.mockTitle}>Quick access</Text>
                <Text style={styles.mockSubtitle}>
                  Choose a workspace to continue (fake login).
                </Text>
                <TouchableOpacity style={styles.mockPrimary} onPress={goToAdmin}>
                  <Text style={styles.mockPrimaryText}>Admin workspace</Text>
                  <Text style={styles.mockPrimarySub}>Claims, drivers, policies</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mockSecondary} onPress={goToDriver}>
                  <Text style={styles.mockSecondaryText}>Driver workspace</Text>
                  <Text style={styles.mockSecondarySub}>Report incident, track claim</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>What you can demo</Text>
                <View style={styles.previewItem}>
                  <View style={styles.previewDot} />
                  <Text style={styles.previewText}>Report Accident multi‑step flow</Text>
                </View>
                <View style={styles.previewItem}>
                  <View style={styles.previewDot} />
                  <Text style={styles.previewText}>Agent chat (ChatGPT‑style)</Text>
                </View>
                <View style={styles.previewItem}>
                  <View style={styles.previewDot} />
                  <Text style={styles.previewText}>Admin dashboard navigation + tables</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why MotorIQ</Text>
            <Text style={styles.sectionSubtitle}>
              A clean, transparent experience for drivers — and an operational dashboard for
              insurers.
            </Text>
            <View style={styles.featureGrid}>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Smarter reporting</Text>
                <Text style={styles.featureText}>
                  Guided steps with consistent evidence capture to reduce manual follow‑ups.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Fraud signals</Text>
                <Text style={styles.featureText}>
                  Simulated “processing” highlights inconsistencies and risk scoring logic.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Admin workflow</Text>
                <Text style={styles.featureText}>
                  Search, filter and review claims, drivers, vehicles and policies.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Deployable web</Text>
                <Text style={styles.featureText}>
                  Static web export supported; local persistence keeps demo data.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              MotorIQ Prototype • Driver app + Admin console • Local mock data
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  page: {
    paddingBottom: 50,
  },
  navbar: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#111827',
    marginRight: 10,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  navLink: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  navLinkText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  navCta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  navCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  container: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  heroRow: {
    flexDirection: 'row',
    columnGap: 20,
    flexWrap: 'wrap',
  },
  heroLeft: {
    flex: 1,
    minWidth: 320,
    paddingRight: 6,
  },
  heroRight: {
    width: 380,
    minWidth: 320,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  pillText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 24,
    lineHeight: 22,
  },
  heroButtons: {
    flexDirection: 'row',
    columnGap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  secondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  statsRow: {
    flexDirection: 'row',
    columnGap: 12,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  statCard: {
    flexGrow: 1,
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  mockPanel: {
    backgroundColor: '#0B1120',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  mockTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 6,
  },
  mockSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  mockPrimary: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  mockPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  mockPrimarySub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  mockSecondary: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 12,
  },
  mockSecondaryText: {
    color: '#E5E7EB',
    fontWeight: '700',
    fontSize: 13,
  },
  mockSecondarySub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 10,
  },
  previewText: {
    fontSize: 12,
    color: '#475569',
  },
  section: {
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    minWidth: 240,
    flexGrow: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  footer: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
  },
});

