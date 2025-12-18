export interface ProgramStep {
  id: string;
  time: string;
  title: string;
  description: string;
  image: string;
}

export interface WeddingStoryProps {
  steps: ProgramStep[];
}
