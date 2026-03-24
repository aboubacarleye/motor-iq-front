import React, { createContext, useContext } from 'react';

type Navigation = {
  navigate: (routeName: string) => void;
  goBack: () => void;
};

const NavigationContext = createContext<Navigation>({
  navigate: () => {},
  goBack: () => {},
});

export function NavigationContainer({ children }: { children: React.ReactNode }) {
  return <NavigationContext.Provider value={{ navigate: () => {}, goBack: () => {} }}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  return useContext(NavigationContext);
}

export type StackNavigationProp<T = any> = Navigation & { params?: T };

