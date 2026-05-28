import { type Room } from './room.types';

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  startTime: string; // ISO string de fecha y hora
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  room?: Room;       // Por si tu backend incluye la relación de la sala
  createdAt: string;
}

export interface CreateReservationInput {
  roomId: string;
  startTime: string;
  endTime: string;
}