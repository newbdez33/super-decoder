import AsyncStorage from '@react-native-async-storage/async-storage';
import { createProgressStore } from '@super-decoder/shared';

export const useProgressStore = createProgressStore(AsyncStorage);
