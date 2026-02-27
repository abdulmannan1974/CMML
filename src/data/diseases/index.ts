import type { DiseaseModule } from '../types';
import { cmmlModule } from './cmml';

const diseases: Record<string, DiseaseModule> = {
  cmml: cmmlModule,
};

export const getDiseaseModule = (slug: string): DiseaseModule | undefined =>
  diseases[slug];

export const getAllDiseases = (): DiseaseModule[] => Object.values(diseases);
