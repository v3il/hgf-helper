import { getRandomArrayItem } from '@components/shared';

const gameTopics = [
    'storyline',
    'plot twists',
    'character development',
    'character relationships',
    'open world exploration',
    'hidden areas and secrets',
    'gameplay mechanics',
    'combat system',
    'graphics',
    'art style',
    'weapons and tools',
    'equipment upgrades',
    'player choices',
    'multiple endings',
    'soundtrack',
    'sound effects',
    'difficulty settings',
    'boss fights',
    'replay value',
    'alternative strategies',
    'game lore',
    'world-building',
    'innovative features',
    'comparisons to other games',
    'multiplayer modes',
    'co-op gameplay',
    'downloadable content (dlcs)',
    'post-launch updates',
    'modding support',
    'easter eggs and references'
];

export const getRandomTopic = () => getRandomArrayItem(gameTopics);
