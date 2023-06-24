import { Portfolio } from './portfolio.model';

export interface Admin {
  id: string;
  name: string;
  password: string;
  portfolio: Portfolio;
}
