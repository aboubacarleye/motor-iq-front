import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';

interface Step {
  label: string;
  completed: boolean;
}

interface Props {
  steps: Step[];
}

export default function TimelineProgress({ steps }: Props) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={step.label} style={styles.row}>
            <View style={styles.indicatorColumn}>
              <View
                style={[
                  styles.circle,
                  step.completed && styles.circleCompleted,
                ]}
              />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    step.completed && styles.lineCompleted,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                step.completed && styles.labelCompleted,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  indicatorColumn: {
    alignItems: 'center',
    marginRight: 8,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  circleCompleted: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 2,
  },
  lineCompleted: {
    backgroundColor: '#2563EB',
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    paddingBottom: 12,
  },
  labelCompleted: {
    color: '#111827',
    fontWeight: '600',
  },
});

