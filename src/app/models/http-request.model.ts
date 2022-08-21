import { Character } from "./character.model";

export interface HttpRequest {
  info?: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results?: Character[];
}