import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useClaimsStore from '../stores/claimsStore';

type Msg = { id: number; from: 'user' | 'ai'; text: string };

function nowId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function agentPlanFromUser(text: string) {
  const t = text.toLowerCase();
  const isAccident =
    t.includes('accident') || t.includes('collision') || t.includes('crash');
  return { isAccident };
}

export default function AssistantChatScreen() {
  const navigation = useNavigation();
  const profile = useClaimsStore((s) => s.profile);
  const vehicles = useClaimsStore((s) => s.profile.vehicles);
  const addClaim = useClaimsStore((s) => s.addClaim);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: 'ai',
      text:
        `Hi ${profile.name.split(' ')[0]}, I’m your MotorIQ assistant. ` +
        `Tell me what happened and I’ll guide you step‑by‑step (photos, voice note, location, police report).`,
    },
  ]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [hasSimPhotos, setHasSimPhotos] = useState(false);
  const [hasSimVoice, setHasSimVoice] = useState(false);
  const [hasSimPoliceReport, setHasSimPoliceReport] = useState(false);

  const suggestedVehicle = useMemo(() => vehicles[0], [vehicles]);

  const push = (m: Msg) => setMessages((prev) => [...prev, m]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    push({ id: nowId(), from: 'user', text });

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 650));

    const plan = agentPlanFromUser(text);
    if (plan.isAccident) {
      push({
        id: nowId(),
        from: 'ai',
        text:
          "I’m sorry this happened. I’ll help you file it quickly.\n\n" +
          `1) Which vehicle was involved? (I can use: ${suggestedVehicle?.make} ${suggestedVehicle?.model} – ${suggestedVehicle?.license_plate})\n` +
          '2) When did it happen? (date + time)\n' +
          '3) I’ll ask you for photos (camera) and a short voice note.\n' +
          '4) Then we confirm the location and attach a police report.\n\n' +
          "Reply with: vehicle + date + time. Example: “Toyota Corolla, today 14:30”.",
      });
    } else {
      push({
        id: nowId(),
        from: 'ai',
        text:
          "Got it. If this is about an incident/claim, tell me: what happened + which vehicle + when. If it’s something else, tell me what you want to do and I’ll guide you.",
      });
    }

    setProcessing(false);
  };

  const simulateProcess = async () => {
    setProcessing(true);
    push({
      id: nowId(),
      from: 'ai',
      text: 'Processing… verifying consistency, extracting key facts, and preparing your draft claim.',
    });
    await new Promise((r) => setTimeout(r, 900));
    push({
      id: nowId(),
      from: 'ai',
      text:
        'Draft ready.\n\n' +
        `- Vehicle: ${suggestedVehicle?.make} ${suggestedVehicle?.model}\n` +
        `- Evidence: ${hasSimPhotos ? 'photos' : 'no photos'}, ${hasSimVoice ? 'voice note' : 'no voice note'}, ${hasSimPoliceReport ? 'police report' : 'no police report'}\n\n` +
        'If you want, I can now start the guided reporting flow so you can confirm everything.',
    });
    setProcessing(false);
  };

  const createMockClaim = () => {
    const created = addClaim({
      description: 'Accident reported via assistant (simulated).',
      status: 'Submitted',
      date_created: new Date().toISOString().slice(0, 10),
      fraud_risk_score: hasSimPhotos && hasSimPoliceReport ? 8 : 22,
      vehicleName: suggestedVehicle
        ? `${suggestedVehicle.make} ${suggestedVehicle.model}`
        : 'Unknown vehicle',
      submissionDate: new Date().toISOString().slice(0, 10),
      images: [],
    });
    push({
      id: nowId(),
      from: 'ai',
      text:
        `Claim ${created.claimId} created in your local session. You can see it under “Claims”. If you want a more detailed claim, tap “Start guided report”.`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MotorIQ Assistant</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.from === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={m.from === 'user' ? styles.userText : styles.aiText}>
              {m.text}
            </Text>
          </View>
        ))}

        {processing && (
          <View style={styles.processingRow}>
            <ActivityIndicator />
            <Text style={styles.processingText}>Thinking…</Text>
          </View>
        )}

        <View style={styles.toolsCard}>
          <Text style={styles.toolsTitle}>Evidence tools (simulation)</Text>
          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={[styles.toolChip, hasSimPhotos && styles.toolChipActive]}
              onPress={() => setHasSimPhotos(true)}
            >
              <Text style={[styles.toolText, hasSimPhotos && styles.toolTextActive]}>
                {hasSimPhotos ? 'Photos attached' : 'Attach photos'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolChip, hasSimVoice && styles.toolChipActive]}
              onPress={() => setHasSimVoice(true)}
            >
              <Text style={[styles.toolText, hasSimVoice && styles.toolTextActive]}>
                {hasSimVoice ? 'Voice note attached' : 'Record voice'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={[styles.toolChip, hasSimPoliceReport && styles.toolChipActive]}
              onPress={() => setHasSimPoliceReport(true)}
            >
              <Text
                style={[
                  styles.toolText,
                  hasSimPoliceReport && styles.toolTextActive,
                ]}
              >
                {hasSimPoliceReport ? 'Police report attached' : 'Attach police report'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primarySmall} onPress={simulateProcess}>
              <Text style={styles.primarySmallText}>Process</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={styles.secondarySmall}
              onPress={() => navigation.navigate('ReportAccident' as never)}
            >
              <Text style={styles.secondarySmallText}>Start guided report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primarySmall} onPress={createMockClaim}>
              <Text style={styles.primarySmallText}>Create claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Message MotorIQ Assistant…"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backText: { color: '#2563EB', fontSize: 14 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  chat: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 24 },
  bubble: {
    maxWidth: '88%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#111827' },
  aiText: { color: '#111827', fontSize: 13, lineHeight: 18 },
  userText: { color: '#FFFFFF', fontSize: 13, lineHeight: 18 },
  processingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 8 },
  processingText: { marginLeft: 8, color: '#6B7280', fontSize: 12 },
  toolsCard: {
    marginTop: 8,
    backgroundColor: '#0B1120',
    borderRadius: 16,
    padding: 12,
  },
  toolsTitle: { color: '#E5E7EB', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  toolsRow: { flexDirection: 'row', columnGap: 8, marginBottom: 8 },
  toolChip: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  toolChipActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  toolText: { color: '#E5E7EB', fontSize: 12 },
  toolTextActive: { color: '#EFF6FF', fontWeight: '600' },
  primarySmall: {
    borderRadius: 999,
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primarySmallText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  secondarySmall: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondarySmallText: { color: '#E5E7EB', fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
    marginRight: 8,
  },
  sendBtn: {
    borderRadius: 999,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});

