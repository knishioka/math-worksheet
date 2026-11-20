import {
  mapStudioTopics,
  type StudioTopic,
} from '../../../config/studio-topics';
import {
  entranceWord,
  entranceWordEn,
  type EntranceContent,
  type EntranceEnContent,
} from '../entrance-exam-shared';
import type { StudioExercise } from './exercise';
import {
  cycle,
  sequence,
  sets,
  polygonAngles,
  compositeArea,
  changingCounts,
} from './patterns';
import {
  averages,
  divisibility,
  percentChange,
  speedUnits,
  equalArea,
  triangleRatio,
  exchange,
} from './quantities';
import {
  similarArea,
  sectors,
  motion,
  solidNets,
  cubeSection,
} from './geometry';
import {
  digitCount,
  clockHands,
  waterDepth,
  stagedRates,
} from './rates-and-counts';

const variants = {
  cycle: cycle,
  sequence: sequence,
  sets: sets,
  'polygon-angles': polygonAngles,
  'composite-area': compositeArea,
  'changing-counts': changingCounts,
  averages: averages,
  divisibility: divisibility,
  'percent-change': percentChange,
  'speed-units': speedUnits,
  'equal-area': equalArea,
  'triangle-ratio': triangleRatio,
  exchange: exchange,
  'digit-count': digitCount,
  'clock-hands': clockHands,
  'water-depth': waterDepth,
  'similar-area': similarArea,
  sectors: sectors,
  motion: motion,
  'solid-nets': solidNets,
  'cube-section': cubeSection,
  'staged-rates': stagedRates,
} satisfies Record<StudioTopic, readonly (() => StudioExercise)[]>;

function generate(topic: StudioTopic, index: number): StudioExercise {
  const choices = variants[topic];
  return choices[index % choices.length]();
}

export const STUDIO_JA_GENERATORS = mapStudioTopics(
  'jap',
  (topic) =>
    (index: number): EntranceContent => {
      const { question, answer, unit, reasoning, calculation, figure } =
        generate(topic, index);
      return {
        figure,
        ...entranceWord(question[0], answer, unit[0], [
          reasoning[0],
          calculation,
        ]),
      };
    }
);

export const STUDIO_EN_GENERATORS = mapStudioTopics(
  'en',
  (topic) =>
    (index: number): EntranceEnContent => {
      const { question, answer, unit, reasoning, calculation, figure } =
        generate(topic, index);
      return {
        figure,
        ...entranceWordEn(question[1], answer, unit[1], [
          reasoning[1],
          calculation,
        ]),
      };
    }
);
