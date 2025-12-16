export interface ProgramStep {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface WeddingStoryProps {
  steps: ProgramStep[];
  frames: string[]; // Array of image URLs for the sequence
}
