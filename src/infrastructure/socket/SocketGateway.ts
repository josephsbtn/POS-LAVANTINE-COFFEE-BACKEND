import { socketService } from "./SocketService";
import { SocketEvents } from "./SocketEvents";
import { logger } from "../../utils/logger";

export const registerSocketGateway = (): void => {
  const io = socketService.getIO();

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on(SocketEvents.TRANSACTION_HISTORY, (data) => {
      logger.debug({ data }, `Event: ${SocketEvents.TRANSACTION_HISTORY}`);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${socket.id} - ${reason}`);
    });
  });

  logger.info("Socket gateway registered");
};
