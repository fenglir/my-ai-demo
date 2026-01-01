
export enum DeviceType {
  PAD = 'PAD',
  PHONE = 'PHONE'
}

export interface Scenario {
  id: string;
  name: string;
  icon: string;
}

export interface AppState {
  activeScenarioId: string;
  scenarios: Scenario[];
}
