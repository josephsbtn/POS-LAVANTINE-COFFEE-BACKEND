import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import { logger } from "../../utils/logger";

class SocketService {
  private static instance: SocketService;
  private io: IOServer | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  initialize(httpServer: HTTPServer, corsOrigin: string): void {
    if (this.io) return;

    this.io = new IOServer(httpServer, {
      cors: {
        origin: corsOrigin,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    logger.info("Socket.IO initialized");
  }

  getIO(): IOServer {
    if (!this.io) {
      throw new Error("Socket.IO not initialized. Call initialize() first.");
    }
    return this.io;
  }

  emit<T>(event: string, data: T): void {
    this.getIO().emit(event, data);
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.io) {
        this.io.close(() => {
          this.io = null;
          logger.info("Socket.IO server closed");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export const socketService = SocketService.getInstance();
