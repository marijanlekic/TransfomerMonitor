import {TransformerHealth} from '@core/models/transformer.enum';

export interface Transformer {
  assetId: number;
  name: string;
  region: string;
  health: TransformerHealth;
  lastTenVoltgageReadings: {timestamp: string, voltage: number}[];
}
