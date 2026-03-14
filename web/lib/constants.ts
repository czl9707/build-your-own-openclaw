export const PHASES = {
  1: {
    name: 'Capable Single Agent',
    steps: ['00', '01', '02', '03', '04', '05', '06'],
    description: 'Build a fully-functional agent that can chat, use tools, learn skills, remember conversations, and access the internet.',
  },
  2: {
    name: 'Event-Driven Architecture',
    steps: ['07', '08', '09', '10'],
    description: 'Refactor to event-driven architecture for scalability and multi-platform support.',
  },
  3: {
    name: 'Autonomous & Multi-Agent',
    steps: ['11', '12', '13', '14', '15'],
    description: 'Add scheduled tasks, agent collaboration, and intelligent routing.',
  },
  4: {
    name: 'Production & Scale',
    steps: ['16', '17'],
    description: 'Production features for reliability and long-term memory.',
  },
} as const

export const SKIP_PATTERNS = [
  '**/.venv/**',
  '**/__pycache__/**',
  '**/node_modules/**',
  '**/*.lock',
  '**/*.svg',
  '**/*.png',
  '**/*.jpg',
  '**/*.pyc',
]

export const STEPS_DIR = '../' // Relative to web/ directory
