export interface PuzzleData {
  topic: string;
  message: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RotorState {
  id: number;
  position: number; // 0-25
  label: string;
}

export interface FrequencyData {
  letter: string;
  frequency: number;
  standard: number;
}
