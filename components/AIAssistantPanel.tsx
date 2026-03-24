import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native-web';

type Message = {
  id: number;
  from: 'user' | 'ai';
  text: string;
};

interface Props {
  context: string;
}

function getAssistantReply(context: string, userText: string): string {
  const lower = userText.toLowerCase();

  if (context.startsWith('report-step-1')) {
    if (lower.includes('accident') || lower.includes('collision')) {
      return "Got it, you were involved in a collision. We'll treat this as a car accident: on the next step I'll ask which vehicle was involved, then we’ll capture photos and the exact location.";
    }
    if (lower.includes('theft') || lower.includes('stolen')) {
      return "Understood, this sounds like a theft claim. Choose “Theft” in the list so we can focus on when and where the vehicle or parts went missing.";
    }
    if (lower.includes('park') || lower.includes('while parked')) {
      return "Thanks. This looks like damage while the car was parked. You can pick “Vehicle Damage” and later we’ll highlight that the vehicle was unattended at the time.";
    }
    return "Tell me in one sentence what happened (for example: “someone hit me from behind at a traffic light”). I’ll then suggest which incident type fits best.";
  }

  if (context.startsWith('report-step-2')) {
    if (lower.includes('date') || lower.includes('time')) {
      return "Try to be as precise as you can with date and time; this is what the insurer uses to cross‑check traffic cameras and other data sources.";
    }
    return "Pick the vehicle that was involved, then set the date and time as close as possible to when it happened. A short description with location, speed and what the other driver did will make the assessment much faster.";
  }

  if (context.startsWith('report-step-3')) {
    if (lower.includes('how many') || lower.includes('photo')) {
      return "Two or three clear photos are usually enough: one close‑up of the damage, one medium shot of the whole side of the car, and one wider shot that shows the surroundings.";
    }
    return "When you take the photo, move slowly and make sure the damaged area and licence plate are both visible. Good lighting and sharp images reduce back‑and‑forth with the adjuster.";
  }

  if (context.startsWith('report-step-4')) {
    if (lower.includes('not sure') || lower.includes('don’t know') || lower.includes('dont know')) {
      return "If you’re not exactly sure of the address, pick the closest point on the map and mention any landmark you remember in your description. That’s usually enough for verification.";
    }
    return "Tap roughly where the accident happened on the map. Matching your description with this location lets the AI quickly detect inconsistencies or possible fraud signals in the background.";
  }

  if (context.startsWith('report-step-5')) {
    if (lower.includes('what to say') || lower.includes('quoi dire')) {
      return "Focus on four things: 1) where you were coming from and going to, 2) road and weather conditions, 3) what the other vehicle did, and 4) what you did just before the impact.";
    }
    return "When you record your voice note, speak like you’re explaining the story to a friend: start with where you were, who was involved, then describe in order what happened and how the car was damaged.";
  }

  if (context.startsWith('report-step-6')) {
    if (lower.includes('ready') || lower.includes('ok')) {
      return "Perfect. Before you hit submit, quickly check: correct vehicle, correct date & time, and that at least one clear damage photo is attached. If that’s all good, you’re ready to submit.";
    }
    return "This is the final check: make sure the photos match your description and that the time and location look right. If something feels off, go back and adjust it now rather than after submission.";
  }

  return "I’ve taken that into account. In this demo I only simulate guidance, but in a live version I’d pre‑fill parts of the claim and highlight anything that looks inconsistent before you submit.";
}

export default function AIAssistantPanel({ context }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'ai',
      text: "Hi, I'm your MotorIQ assistant. Ask me anything about reporting this incident or understanding your claim.",
    },
  ]);
  const [input, setInput] = useState('');
  const [hasSimulatedUpload, setHasSimulatedUpload] = useState(false);
  const [hasSimulatedVoice, setHasSimulatedVoice] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      from: 'user',
      text: input.trim(),
    };
    const aiMessage: Message = {
      id: Date.now() + 1,
      from: 'ai',
      text: getAssistantReply(context, input.trim()),
    };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput('');
  };

  const handleSimulateUpload = () => {
    if (hasSimulatedUpload) return;
    setHasSimulatedUpload(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: 'ai',
        text:
          'I’ve linked this step to your incident photos. In a real deployment I would check image quality and flag anything suspicious automatically.',
      },
    ]);
  };

  const handleSimulateVoice = () => {
    if (hasSimulatedVoice) return;
    setHasSimulatedVoice(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        from: 'ai',
        text:
          'Your voice note is attached to this claim. Here I only simulate it, but normally I would transcribe it and highlight the key facts for the adjuster.',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MotorIQ assistant</Text>
      <ScrollView
        style={styles.messages}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.messageBubble,
              m.from === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={m.from === 'user' ? styles.userText : styles.aiText}
            >
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask for help with this step..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.chip,
            hasSimulatedUpload && styles.chipActive,
          ]}
          onPress={handleSimulateUpload}
        >
          <Text
            style={[
              styles.chipText,
              hasSimulatedUpload && styles.chipTextActive,
            ]}
          >
            {hasSimulatedUpload ? 'Photos linked' : 'Simulate photo upload'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chip,
            hasSimulatedVoice && styles.chipActive,
          ]}
          onPress={handleSimulateVoice}
        >
          <Text
            style={[
              styles.chipText,
              hasSimulatedVoice && styles.chipTextActive,
            ]}
          >
            {hasSimulatedVoice ? 'Voice note linked' : 'Simulate voice note'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#0F172A',
    padding: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  messages: {
    maxHeight: 120,
    marginBottom: 8,
  },
  messageBubble: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 4,
    maxWidth: '90%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1F2937',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#111827',
  },
  aiText: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  userText: {
    fontSize: 12,
    color: '#F9FAFB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  input: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#020617',
    color: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    marginRight: 6,
  },
  sendButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  sendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    columnGap: 6,
  },
  chip: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  chipText: {
    fontSize: 11,
    color: '#E5E7EB',
  },
  chipTextActive: {
    color: '#EFF6FF',
    fontWeight: '600',
  },
});

