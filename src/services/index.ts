// Services
export { default as authService } from './authService';
export { default as firestoreService } from './firestoreService';
export { default as mlKitService } from './mlKitService';
export { default as IconService } from './iconService';
// Firebase est initialisé automatiquement par React Native Firebase
export { default as locationService } from './locationService';
export { useLocation } from './useLocation';
export { default as collecteService } from './collecteService';
export { default as statsService } from './statsService';
export { default as localStatsService } from './localStatsService';

// Types et interfaces
export * from './authService';
export * from './firestoreService';
export * from './locationService';
export * from './collecteService';
export type { UserStats, ScanResult } from './statsService';
