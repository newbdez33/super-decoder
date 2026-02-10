import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSettingsStore } from '@super-decoder/shared';

export const useSettingsStore = createSettingsStore(AsyncStorage);
