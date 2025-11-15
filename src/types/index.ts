import { Role, BookingStatus } from '@prisma/client';

export type { Role, BookingStatus };

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  bio?: string | null;
  phone?: string | null;
  createdAt: Date;
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  maxGuests: number;
  amenities?: any;
  photos: string[];
  availableFrom: Date;
  availableTo: Date;
  createdAt: Date;
  host?: User;
}

export interface Booking {
  id: string;
  listingId: string;
  studentId: string;
  status: BookingStatus;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  message?: string | null;
  createdAt: Date;
  listing?: Listing;
  student?: User;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  sender?: User;
}

