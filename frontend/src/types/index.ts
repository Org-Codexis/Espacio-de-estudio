// src/types/index.ts

export interface Role {
  id: number;
  name: string; // 'ADMIN', 'USER', etc.
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  role?: Role;
}

export interface Space {
  id: number;
  name: string;
  peopleCount: number; // Reemplaza definitivamente a 'capacity'
  location: string;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  userId: number;
  spaceId: number;
  reservationDate: string; // Formato YYYY-MM-DD
  startTime: string;       // Formato HH:MM
  endTime: string;         // Requerido obligatoriamente por el DTO del backend
  user?: User;
  space?: Space;
}