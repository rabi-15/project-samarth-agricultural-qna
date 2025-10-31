
export interface Source {
  sourceName: string;
  description: string;
}

export interface SamarthResponse {
  analysis: string;
  summaryPoints: string[];
  sources: Source[];
}
