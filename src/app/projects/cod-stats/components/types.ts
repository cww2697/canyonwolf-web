export type CsvRow = string[];
export type TransformedRow = {
  utc: string;
  kills: number;
  deaths: number;
  skill: string;
  kdRatio: number;
};
export type SortKey = "utc" | "kills" | "deaths" | "skill" | "kdRatio";
