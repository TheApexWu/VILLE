export type SynthesisTier = 'none' | 'minimal' | 'light' | 'mixed' | 'heavy';
export const FABULATED: SynthesisTier[] = ['mixed', 'heavy'];

export interface EntityId { overture?: string; osm?: string; wikidata?: string; }
export interface Entity {
  id: EntityId;
  name?: string;
  geometry: string;
  provenance: string;
  synthesis_tier: SynthesisTier;
  media?: string[];
  fragments?: string[];
  textures?: string[];
}
export interface PackManifest {
  pack: string;
  spec_version: string;
  city: string;
  epoch: string;
  license?: string;
  methods?: string;
  entities: Entity[];
}
