import {ValueLabel,ValueLabelId} from "../types/form.js";

export const SortOptions: ValueLabel[] = [
  { value: 'newest', label: "Newest first" },
  { value: 'money', label: "Highest salary" },
  { value: 'rating', label: "Best reviewed" },
];

export const ExperienceOptions : ValueLabel[] = [
  { value: 'entry', label: "Entry" },
  { value: 'mid', label: "Mid" },
  { value: 'senior', label: "Senior" },
];

export const ExperienceLookup = {
  'entry':0,
  'mid':1,
  'senior':2
}