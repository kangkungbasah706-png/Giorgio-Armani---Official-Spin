
export interface Prize {
  id: number;
  label: string;
  color: string;
  value: string;
  icon: string;
}

export interface SpinResult {
  prize: Prize;
  fortune?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  WINNER = 'WINNER'
}
