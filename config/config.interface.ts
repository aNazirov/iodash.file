export interface AppConfig {
  host: string;
  port: number | 3000;
  jwtSecret: string;
  client: string;
  mode: string;
  database: {
    host: string | 'localhost';
    port: number | 5432;
  };
}
