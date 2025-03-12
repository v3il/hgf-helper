import { getRandomNumber } from './getRandomNumber';

export const getRandomArrayItem = <T>(arr: T[]): T => arr[getRandomNumber(0, arr.length)];
