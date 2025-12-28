/**
 * API Server entry point
 */

import { APIServer } from './APIServer.js';

const server = new APIServer(3001);

server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});







