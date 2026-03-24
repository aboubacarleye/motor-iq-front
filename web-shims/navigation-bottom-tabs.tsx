import React from 'react';

type ScreenProps = { name: string; component: React.ComponentType<any> };

function Screen(_props: ScreenProps) {
  return null;
}

function Navigator({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function createBottomTabNavigator() {
  return { Navigator, Screen };
}

