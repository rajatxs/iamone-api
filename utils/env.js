
const _toBool = (v) => Boolean(Number(process.env[v]));

export const NODE_ENV = process.env.NODE_ENV;
export const HOST_URL = process.env.HOST_URL;
export const PORT = Number(process.env.PORT);
export const ENABLE_DEBUG_LOGS = _toBool('ENABLE_DEBUG_LOGS');
export const ADMIN_KEY_INTEGRITY = process.env.ADMIN_KEY_INTEGRITY;
export const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Infura IPFS
export const INFURA_IPFS_PROJECT_ID = process.env.INFURA_IPFS_PROJECT_ID;
export const INFURA_IPFS_PROJECT_SECRET = process.env.INFURA_IPFS_PROJECT_SECRET;
export const INFURA_IPFS_ENDPOINT = process.env.INFURA_IPFS_ENDPOINT;
