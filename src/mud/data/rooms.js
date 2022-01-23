const rooms = Object.freeze({
  'dirt-road': {
    name: 'Dirt Road',
    description: 'You are standing on a dirt road. To the west you see an inn.',
    exits: {
      west: 'inn'
    }
  },
  inn: {
    name: 'Sleepy Inn',
    description:
      'This inn offers hot food and a warm bed for test. East is the road.',
    exits: {
      east: 'dirt-road'
    }
  },
  'start-room': 'dirt-road'
});

export { rooms };
