export interface Room {
  id: string;         // o number, dependiendo de cómo lo definiste en Prisma
  name: string;       // Ejemplo: "Sala de Cómputo A"
  capacity: number;   // Cantidad máxima de personas
  description?: string;
  isAvailable: boolean;
  createdAt: string;
}

// Tipo para cuando creemos una nueva sala (sin el ID ni fechas automáticas)
export type CreateRoomInput = Omit<Room, 'id' | 'createdAt'>;