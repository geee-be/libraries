export type Json = boolean | number | string | JsonObject | JsonArray | null;

export interface JsonObject {
  [key: string]: Json;
}

export type JsonArray = Json[];
