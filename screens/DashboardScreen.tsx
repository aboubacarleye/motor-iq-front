import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <View style={{ padding: 20 }}>
      <Text>Dashboard</Text>
      <Text>Policy Overview</Text>
      <Text>Claim Status</Text>
      <Button title="Report Accident" onPress={() => navigation.navigate('ReportAccident')} />
      <Button title="Claims Tracking" onPress={() => navigation.navigate('ClaimsTracking')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}