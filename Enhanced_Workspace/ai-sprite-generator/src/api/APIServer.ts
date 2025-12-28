/**
 * API Server
 * 
 * Express.js server with WebSocket support for real-time updates.
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { generateRoute } from './routes/generate.js';
import { scanRoute } from './routes/scan.js';
import { motionRoute } from './routes/motion.js';

/**
 * API Server
 */
export class APIServer {
  private app: express.Application;
  private server: ReturnType<typeof createServer>;
  private io: SocketIOServer;
  private port: number;

  constructor(port: number = 3001) {
    this.port = port;
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    this.app.use('/api/generate', generateRoute(this.io));
    this.app.use('/api/scan', scanRoute(this.io));
    this.app.use('/api/motion', motionRoute(this.io));
    
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok' });
    });
  }

  /**
   * Setup WebSocket
   */
  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  /**
   * Start server
   */
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`API server running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Stop server
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('API server stopped');
        resolve();
      });
    });
  }

  /**
   * Get Socket.IO instance
   */
  getIO(): SocketIOServer {
    return this.io;
  }
}

