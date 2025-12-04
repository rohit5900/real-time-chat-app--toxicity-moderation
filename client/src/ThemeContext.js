import { createContext, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const lightTheme = {
  bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  text: '#1a1a2e',
  cardBg: 'rgba(255, 255, 255, 0.6)',
  cardBorder: 'rgba(0, 0, 0, 0.1)',
  sidebarBg: 'rgba(255, 255, 255, 0.5)',
  inputBg: 'rgba(0, 0, 0, 0.05)',
  accent: '#4ecca3',
  ownMsgBg: '#4ecca3',
  otherMsgBg: 'rgba(0, 0, 0, 0.05)',
  ownMsgText: '#1a1a2e',
  otherMsgText: '#1a1a2e'
};

export const darkTheme = {
  bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  text: '#fff',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  sidebarBg: 'rgba(0, 0, 0, 0.3)',
  inputBg: 'rgba(255, 255, 255, 0.1)',
  accent: '#4ecca3',
  ownMsgBg: '#4ecca3',
  otherMsgBg: 'rgba(255, 255, 255, 0.15)',
  ownMsgText: '#1a1a2e',
  otherMsgText: '#fff'
};
