import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import useClaimsStore from '../stores/claimsStore';

type Page = 'Dashboard' | 'Claims' | 'Drivers' | 'Vehicles' | 'Policies';

export default function AdminDashboardScreen() {
  const claims = useClaimsStore((s) => s.claims);
  const driver = useClaimsStore((s) => s.profile);
  const [page, setPage] = useState<Page>('Dashboard');
  const [query, setQuery] = useState('');

  const totalClaims = claims.length;
  const highRisk = claims.filter((c) => c.fraud_risk_score >= 70).length;
  const pending = claims.filter((c) => c.status === 'Submitted' || c.status === 'Under Review')
    .length;

  const fakeDrivers = useMemo(
    () => [
      { id: 'DRV-001', name: driver.name, phone: driver.phone, vehicles: driver.vehicles.length },
      { id: 'DRV-002', name: 'Marcus Chen', phone: '+1 415 555 0199', vehicles: 3 },
      { id: 'DRV-003', name: 'Jane Doe', phone: '+44 20 7946 0958', vehicles: 1 },
      { id: 'DRV-004', name: 'Robert Smith', phone: '+33 1 84 88 12 00', vehicles: 2 },
    ],
    [driver.name, driver.phone, driver.vehicles.length],
  );

  const filteredClaims = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return claims;
    return claims.filter((c) => {
      return (
        c.claimId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.vehicleName.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
      );
    });
  }, [claims, query]);

  const navItem = (label: Page) => {
    const active = page === label;
    return (
      <TouchableOpacity
        key={label}
        style={[styles.navBtn, active && styles.navBtnActive]}
        onPress={() => setPage(label)}
      >
        <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <Text style={styles.logo}>MotorIQ</Text>
        <Text style={styles.subLogo}>ENTERPRISE</Text>
        <View style={{ height: 16 }} />
        {(['Dashboard', 'Claims', 'Drivers', 'Vehicles', 'Policies'] as Page[]).map(navItem)}
        <View style={styles.sidebarFooter}>
          <Text style={styles.agentLabel}>AI Agents</Text>
          <Text style={styles.agentText}>Fraud detection, triage, auto‑verification.</Text>
        </View>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <View style={styles.topBar}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search claims, drivers, vehicles…"
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
          </View>
          <View style={styles.topBarRight}>
            <View style={styles.userBadge}>
              <Text style={styles.userInitials}>MC</Text>
            </View>
            <Text style={styles.userName}>System Admin</Text>
          </View>
        </View>

        {page === 'Dashboard' && (
          <>
            <Text style={styles.mainTitle}>Main Dashboard</Text>
            <Text style={styles.mainSubtitle}>
              Real‑time fleet performance and claim intelligence (simulation).
            </Text>

            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Claims</Text>
                <Text style={styles.metricValue}>{totalClaims}</Text>
                <Text style={styles.metricDelta}>+12.4%</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>High‑risk Claims</Text>
                <Text style={styles.metricValue}>{highRisk}</Text>
                <Text style={[styles.metricDelta, { color: '#FCA5A5' }]}>+5.2%</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Pending Reviews</Text>
                <Text style={styles.metricValue}>{pending}</Text>
                <Text style={[styles.metricDelta, { color: '#86EFAC' }]}>-3.1%</Text>
              </View>
            </View>

            <View style={styles.panelRow}>
              <View style={styles.prioritizedCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Prioritized claims</Text>
                  <Text style={styles.linkText}>View all</Text>
                </View>
                {claims.slice(0, 6).map((c) => (
                  <View key={c.id} style={styles.claimRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.claimId}>{c.claimId}</Text>
                      <Text style={styles.claimDesc}>
                        {c.vehicleName} • {c.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        c.fraud_risk_score >= 70
                          ? styles.badgeHigh
                          : c.fraud_risk_score >= 30
                          ? styles.badgeMed
                          : styles.badgeLow,
                      ]}
                    >
                      <Text style={styles.badgeText}>
                        {c.fraud_risk_score >= 70
                          ? 'Critical'
                          : c.fraud_risk_score >= 30
                          ? 'Medium'
                          : 'Low'}
                      </Text>
                    </View>
                    <Text style={styles.statusText}>{c.status}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.aiPanel}>
                <Text style={styles.sectionTitle}>Auto‑verification</Text>
                <View style={styles.aiStatRow}>
                  <Text style={styles.aiStatLabel}>Verified</Text>
                  <Text style={styles.aiStatValue}>82%</Text>
                </View>
                <View style={styles.aiStatRow}>
                  <Text style={styles.aiStatLabel}>Needs review</Text>
                  <Text style={styles.aiStatValue}>12%</Text>
                </View>
                <View style={styles.aiStatRow}>
                  <Text style={styles.aiStatLabel}>Failed</Text>
                  <Text style={styles.aiStatValue}>6%</Text>
                </View>
                <Text style={styles.aiText}>
                  Agents route high‑risk claims to analysts and fast‑track low‑risk claims for
                  instant payouts (simulated).
                </Text>
              </View>
            </View>
          </>
        )}

        {page === 'Claims' && (
          <View style={styles.tableCard}>
            <Text style={styles.mainTitle}>Claims queue</Text>
            <Text style={styles.mainSubtitle}>Review, prioritize and export claims (simulation).</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { flex: 1.1 }]}>Claim ID</Text>
              <Text style={[styles.th, { flex: 1.2 }]}>Vehicle</Text>
              <Text style={[styles.th, { flex: 2 }]}>Description</Text>
              <Text style={[styles.th, { flex: 0.9 }]}>Risk</Text>
              <Text style={[styles.th, { flex: 1 }]}>Status</Text>
              <Text style={[styles.th, { flex: 1 }]}>Date</Text>
            </View>
            {filteredClaims.slice(0, 25).map((c) => (
              <View key={c.id} style={styles.tr}>
                <Text style={[styles.td, { flex: 1.1 }]}>{c.claimId}</Text>
                <Text style={[styles.td, { flex: 1.2 }]}>{c.vehicleName}</Text>
                <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>
                  {c.description}
                </Text>
                <Text style={[styles.td, { flex: 0.9 }]}>{c.fraud_risk_score}/100</Text>
                <Text style={[styles.td, { flex: 1 }]}>{c.status}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{c.submissionDate}</Text>
              </View>
            ))}
          </View>
        )}

        {page === 'Drivers' && (
          <View style={styles.tableCard}>
            <Text style={styles.mainTitle}>Drivers</Text>
            <Text style={styles.mainSubtitle}>List of policyholders (simulation).</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { flex: 1 }]}>Driver ID</Text>
              <Text style={[styles.th, { flex: 1.6 }]}>Name</Text>
              <Text style={[styles.th, { flex: 1.6 }]}>Phone</Text>
              <Text style={[styles.th, { flex: 0.8 }]}>Vehicles</Text>
            </View>
            {fakeDrivers.map((d) => (
              <View key={d.id} style={styles.tr}>
                <Text style={[styles.td, { flex: 1 }]}>{d.id}</Text>
                <Text style={[styles.td, { flex: 1.6 }]}>{d.name}</Text>
                <Text style={[styles.td, { flex: 1.6 }]}>{d.phone}</Text>
                <Text style={[styles.td, { flex: 0.8 }]}>{d.vehicles}</Text>
              </View>
            ))}
          </View>
        )}

        {page === 'Vehicles' && (
          <View style={styles.tableCard}>
            <Text style={styles.mainTitle}>Vehicles</Text>
            <Text style={styles.mainSubtitle}>Registered vehicles (simulation).</Text>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { flex: 1.4 }]}>Plate</Text>
              <Text style={[styles.th, { flex: 1.2 }]}>Make</Text>
              <Text style={[styles.th, { flex: 1.2 }]}>Model</Text>
              <Text style={[styles.th, { flex: 0.8 }]}>Year</Text>
            </View>
            {driver.vehicles.map((v) => (
              <View key={v.id} style={styles.tr}>
                <Text style={[styles.td, { flex: 1.4 }]}>{v.license_plate}</Text>
                <Text style={[styles.td, { flex: 1.2 }]}>{v.make}</Text>
                <Text style={[styles.td, { flex: 1.2 }]}>{v.model}</Text>
                <Text style={[styles.td, { flex: 0.8 }]}>{v.year}</Text>
              </View>
            ))}
          </View>
        )}

        {page === 'Policies' && (
          <View style={styles.tableCard}>
            <Text style={styles.mainTitle}>Policies</Text>
            <Text style={styles.mainSubtitle}>Active policies (simulation).</Text>
            <View style={styles.policyCard}>
              <Text style={styles.policyName}>{driver.policy.name}</Text>
              <Text style={styles.policyMeta}>Policy No: {driver.policy.policyNumber}</Text>
              <Text style={styles.policyMeta}>Coverage: {driver.policy.coverageLimit}</Text>
              <Text style={styles.policyMeta}>Renews: {driver.policy.renewalDate}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#020617',
  },
  sidebar: {
    width: 220,
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: '#020617',
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: 2,
  },
  subLogo: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#64748B',
    fontWeight: '700',
  },
  navBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  navBtnActive: {
    backgroundColor: '#0F172A',
  },
  navText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  navTextActive: {
    color: '#F9FAFB',
    fontWeight: '600',
  },
  sidebarFooter: {
    marginTop: 40,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0F172A',
  },
  agentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  agentText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  main: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    maxWidth: 540,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#111827',
  },
  searchIcon: {
    color: '#94A3B8',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 13,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  userBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  userName: {
    marginLeft: 8,
    color: '#94A3B8',
    fontSize: 12,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#020617',
    padding: 14,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  metricDelta: {
    marginTop: 6,
    fontSize: 12,
    color: '#86EFAC',
    fontWeight: '600',
  },
  panelRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginTop: 4,
  },
  prioritizedCard: {
    flex: 2,
    borderRadius: 16,
    backgroundColor: '#020617',
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 12,
    color: '#60A5FA',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 10,
  },
  claimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  claimId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  claimDesc: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#1D4ED8',
    marginHorizontal: 6,
  },
  badgeHigh: { backgroundColor: '#991B1B' },
  badgeMed: { backgroundColor: '#92400E' },
  badgeLow: { backgroundColor: '#1D4ED8' },
  badgeText: {
    fontSize: 11,
    color: '#EFF6FF',
  },
  statusText: {
    fontSize: 11,
    color: '#FBBF24',
  },
  aiPanel: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#111827',
    padding: 16,
  },
  aiText: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 6,
  },
  aiStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  aiStatLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  aiStatValue: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  tableCard: {
    borderRadius: 16,
    backgroundColor: '#020617',
    padding: 16,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
    marginTop: 10,
  },
  th: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  td: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  policyCard: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    padding: 14,
  },
  policyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  policyMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});

