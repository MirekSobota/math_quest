import type { Upgrade } from '../types/game';

export const upgradesPool: Upgrade[] = [
  {
    id: 'heal-small',
    title: 'Magic Heart',
    description: '+1 HP',
    type: 'heal',
    value: 1,
  },
  {
    id: 'damage-up',
    title: 'Power Wand',
    description: '+1 damage',
    type: 'damage',
    value: 1,
  },
  {
    id: 'coin-boost',
    title: 'Treasure Bag',
    description: '+10 coins',
    type: 'coins',
    value: 10,
  },
];