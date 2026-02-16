let ioInstance = null;

export function setIO(io) {
  ioInstance = io;
}

export function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io não foi inicializado!");
  }
  return ioInstance;
}