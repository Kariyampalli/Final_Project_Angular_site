export interface Logger {
  log(message: unknown): void;
  log(message: string): void;
  log(message: any): void;
}
