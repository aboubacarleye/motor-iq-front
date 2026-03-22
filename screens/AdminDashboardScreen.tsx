

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, ActivityIndicator } from 'react-native';

import useClaimsStore from '../stores/claimsStore';

type Page = 'Dashboard' | 'Claims' | 'Drivers' | 'Vehicles' | 'Policies';

export default function AdminDashboardScreen() {
  const claims = useClaimsStore((s) => s.claims);
  const driver = useClaimsStore((s) => s.profile);
  const [page, setPage] = useState<Page>('Dashboard');
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showClaimEval, setShowClaimEval] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  // Vehicle validation state: { [vehicleId]: 'Auto' | 'Invalid' | 'To verify' }
  const [vehicleValidations, setVehicleValidations] = useState(() => {
    const initial: Record<string, string> = {};
    driver.vehicles.forEach((v, idx) => {
      initial[v.id] = idx % 3 === 0 ? 'Auto' : idx % 3 === 1 ? 'Invalid' : 'To verify';
    });
    return initial;
  });

  const handleVehicleValidation = (vehicleId: string, value: string) => {
    setVehicleValidations((prev) => ({ ...prev, [vehicleId]: value }));
  };

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
    <View style={[styles.root, isMobile && styles.rootMobile]}>
      <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
        <Text style={styles.logo}>MotorIQ</Text>
        <Text style={styles.subLogo}>ENTERPRISE</Text>
        <View style={{ height: 16 }} />
        {(['Dashboard', 'Claims', 'Drivers', 'Vehicles', 'Policies'] as Page[]).map(navItem)}
        <View style={styles.sidebarFooter}>
          <Text style={styles.agentLabel}>AI Agents</Text>
          <Text style={styles.agentText}>Fraud detection, triage, auto‑verification.</Text>
        </View>
      </View>

      <ScrollView style={[styles.main, isMobile && styles.mainMobile]} contentContainerStyle={[styles.mainContent, isMobile && styles.mainContentMobile]}>
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

            <View style={[styles.metricsRow, isMobile && styles.metricsRowMobile]}>
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

            <View style={[styles.panelRow, isMobile && styles.panelRowMobile]}>
              <View style={styles.prioritizedCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Prioritized claims</Text>
                  <TouchableOpacity onPress={() => {/* TODO: implement view all action */}}>
                    <Text style={styles.linkText}>View all</Text>
                  </TouchableOpacity>
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
              <Text style={[styles.th, { flex: 1 }]}>Actions</Text>
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
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <TouchableOpacity onPress={() => setSelectedClaim(c)}>
                    <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>View more</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {/* Modale détails claim */}
            {selectedClaim && !showClaimEval && (
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Claim Details</Text>
                    <TouchableOpacity onPress={() => setSelectedClaim(null)}>
                      <TouchableOpacity onPress={() => setSelectedClaim(null)}>
                        <Text style={styles.closeText}>Close</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalMeta}>ID: {selectedClaim.claimId}</Text>
                  <Text style={styles.modalMeta}>Vehicle: {selectedClaim.vehicleName}</Text>
                  <Text style={styles.modalMeta}>Description: {selectedClaim.description}</Text>
                  <Text style={styles.modalMeta}>Status: {selectedClaim.status}</Text>
                  <Text style={styles.modalMeta}>Date: {selectedClaim.submissionDate}</Text>
                  <Text style={styles.modalMeta}>AI Score: {selectedClaim.fraud_risk_score}/100</Text>
                  <Text style={styles.modalMeta}>AI Explanation: {selectedClaim.fraud_risk_score > 70 ? "High risk detected by AI." : selectedClaim.fraud_risk_score > 30 ? "Medium risk." : "Low risk."}</Text>
                  {/* Affichage audio, image, GPS */}
                  {selectedClaim.audioUrl && (
                    <Text style={styles.modalMeta}>
                      Audio: <Text style={{ color: '#2563EB', textDecorationLine: 'underline' }} onPress={() => window.open(selectedClaim.audioUrl, '_blank')}>Play audio</Text>
                    </Text>
                  )}
                  {selectedClaim.imageUrl && (
                    <Text style={styles.modalMeta}>
                      Image: <Text style={{ color: '#2563EB', textDecorationLine: 'underline' }} onPress={() => window.open(selectedClaim.imageUrl, '_blank')}>View image</Text>
                    </Text>
                  )}
                  {selectedClaim.gpsCoordinates && (
                    <Text style={styles.modalMeta}>
                      GPS: {selectedClaim.gpsCoordinates.latitude}, {selectedClaim.gpsCoordinates.longitude}
                    </Text>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14 }}
                      onPress={() => {
                        setShowClaimEval(true);
                        setLoadingEval(true);
                        setEvalResult(null);
                        setTimeout(() => {
                          setLoadingEval(false);
                          setEvalResult({
                            score: selectedClaim.fraud_risk_score,
                            explanation: selectedClaim.fraud_risk_score > 70 ? "High risk detected by AI (multiple anomalies in the claim)." : selectedClaim.fraud_risk_score > 30 ? "Medium risk: some inconsistencies found." : "Low risk: claim seems consistent.",
                          });
                        }, 1800);
                      }}
                    >
                      <Text style={{ fontSize: 18, marginRight: 8 }}>🪄</Text>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Verify with our AI</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {/* Modale évaluation IA */}
            {showClaimEval && (
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Évaluation IA</Text>
                    <TouchableOpacity onPress={() => { setShowClaimEval(false); setSelectedClaim(null); }}>
                      <Text style={styles.closeText}>Fermer</Text>
                    </TouchableOpacity>
                  </View>
                  {loadingEval ? (
                    <View style={{ alignItems: 'center', marginVertical: 24 }}>
                      <ActivityIndicator size="large" color="#2563EB" />
                      <Text style={{ marginTop: 16, color: '#2563EB' }}>Analyse IA en cours...</Text>
                    </View>
                  ) : evalResult && (
                    <View style={{ alignItems: 'center', marginVertical: 16 }}>
                      <Text style={{ fontSize: 32, fontWeight: 'bold', color: evalResult.score > 70 ? '#EF4444' : evalResult.score > 30 ? '#F59E42' : '#22C55E' }}>{evalResult.score}/100</Text>
                      <Text style={{ marginTop: 10, fontSize: 16, color: '#111', textAlign: 'center' }}>{evalResult.explanation}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
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
              <Text style={[styles.th, { flex: 1 }]}>Actions</Text>
            </View>
            {fakeDrivers.map((d) => (
              <View key={d.id} style={styles.tr}>
                <Text style={[styles.td, { flex: 1 }]}>{d.id}</Text>
                <Text style={[styles.td, { flex: 1.6 }]}>{d.name}</Text>
                <Text style={[styles.td, { flex: 1.6 }]}>{d.phone}</Text>
                <Text style={[styles.td, { flex: 0.8 }]}>{d.vehicles}</Text>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => setSelectedDriver(d)}>
                    <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>View more</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {/* Modale détails driver */}
            {selectedDriver && (
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Driver Details</Text>
                    <TouchableOpacity onPress={() => setSelectedDriver(null)}>
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalMeta}>ID: {selectedDriver.id}</Text>
                  <Text style={styles.modalMeta}>Name: {selectedDriver.name}</Text>
                  <Text style={styles.modalMeta}>Phone: {selectedDriver.phone}</Text>
                  <Text style={styles.modalMeta}>Number of vehicles: {selectedDriver.vehicles}</Text>
                </View>
              </View>
            )}
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
              <Text style={[styles.th, { flex: 1 }]}>Vérification</Text>
            </View>
            {driver.vehicles.map((v) => (
              <View key={v.id} style={styles.tr}>
                <Text style={[styles.td, { flex: 1.4 }]}>{v.license_plate}</Text>
                <Text style={[styles.td, { flex: 1.2 }]}>{v.make}</Text>
                <Text style={[styles.td, { flex: 1.2 }]}>{v.model}</Text>
                <Text style={[styles.td, { flex: 0.8 }]}>{v.year}</Text>
                <View style={[styles.td, { flex: 1, flexDirection: 'row', alignItems: 'center' }]}> 
                  <select
                    value={vehicleValidations[v.id]}
                    onChange={e => handleVehicleValidation(v.id, e.target.value)}
                    style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', fontWeight: 'bold', color: vehicleValidations[v.id] === 'Auto' ? '#22C55E' : vehicleValidations[v.id] === 'Invalid' ? '#EF4444' : '#F59E42', background: '#fff' }}
                  >
                    <option value="Auto">Auto</option>
                    <option value="Invalid">Invalid</option>
                    <option value="To verify">To verify</option>
                  </select>
                </View>
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
    backgroundColor: '#fff',
  },
  rootMobile: {
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: 220,
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  sidebarMobile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainMobile: {
    width: '100%',
    padding: 0,
    backgroundColor: '#fff',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  mainContentMobile: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  subLogo: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#555',
    fontWeight: '700',
  },
  navBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  navBtnActive: {
    backgroundColor: '#F1F5F9',
  },
  navText: {
    fontSize: 13,
    color: '#111',
  },
  navTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  sidebarFooter: {
    marginTop: 40,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  agentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  agentText: {
    fontSize: 11,
    color: '#2563EB',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchIcon: {
    color: '#64748B',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#1E293B',
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
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    marginLeft: 8,
    color: '#334155',
    fontSize: 12,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 20,
  },
  metricsRowMobile: {
    flexDirection: 'column',
    rowGap: 12,
    width: '100%',
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    padding: 14,
    minWidth: 0,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  metricDelta: {
    marginTop: 6,
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  panelRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginTop: 4,
  },
  panelRowMobile: {
    flexDirection: 'column',
    rowGap: 16,
    width: '100%',
  },
  prioritizedCard: {
    flex: 2,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    padding: 16,
    minWidth: 0,
    width: '100%',
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
    color: '#1E293B',
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
    color: '#1E293B',
  },
  claimDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    marginHorizontal: 6,
  },
  badgeHigh: { backgroundColor: '#EF4444' },
  badgeMed: { backgroundColor: '#F59E42' },
  badgeLow: { backgroundColor: '#2563EB' },
  badgeText: {
    fontSize: 11,
    color: '#fff',
  },
  statusText: {
    fontSize: 11,
    color: '#F59E42',
  },
  aiPanel: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#E0E7EF',
    padding: 16,
    minWidth: 0,
    width: '100%',
  },
  aiText: {
    fontSize: 12,
    color: '#1E293B',
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
    backgroundColor: '#F3F4F6',
    padding: 16,
    width: '100%',
    minWidth: 0,
    marginBottom: 16,
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
    color: '#1E293B',
    fontWeight: '600',
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CBD5E1',
  },
  td: {
    fontSize: 12,
    color: '#334155',
  },
  policyCard: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#E0E7EF',
    padding: 14,
    width: '100%',
    minWidth: 0,
  },
  policyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  policyMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});

