import {TransformerHealth} from '@core/models/transformer.enum';

export const TRANSFORMER_HEALTH_COLORS: Record<TransformerHealth, string> = {
  [TransformerHealth.EXCELLENT]: '--clr-green-400',
  [TransformerHealth.GOOD]: '--clr-green-100',
  [TransformerHealth.FAIR]: '--clr-yellow-400',
  [TransformerHealth.POOR]: '--clr-orange-400',
  [TransformerHealth.CRITICAL]: '--clr-red-400'
};
