export interface Config {
  port: number;
  dbName: string;
  dbUser: string;
  dbPass: string;
  privateKey: string;
  publicKey: string;
  redisUrl: string;
}

export default (): Config => ({
  port: parseInt(process.env.PORT!) || 3000,
  dbName: process.env.DB_NAME!,
  dbUser: process.env.DB_USER!,
  dbPass: process.env.DB_PASS!,
  privateKey: process.env.PRIVATE_KEY!,
  publicKey: process.env.PUBLIC_KEY!,
  redisUrl: process.env.REDIS_URL!,
});
