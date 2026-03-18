
export interface BaseContact {
  name: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  info: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  category: 'Staff' | 'Resident';
  role?: string;
}

export interface Contact extends BaseContact {
  id: string;
}

export interface Announcement {
  id: string;
  text: string;
  timestamp: number;
}

export interface AdminUser {
  id: string;
  email: string;
  password?: string;
}

export interface ResourceDocument {
  id: string;
  name: string;
  url: string;
  timestamp: number;
}

export interface ButtonResources {
  [category: string]: ResourceDocument[];
}

export interface ButtonLinks {
  fullCount: string;
  firstMate: string;
  requestForms: string;
  directorySheet?: string;
  [key: string]: string | undefined;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum View {
  SPLASH = 'SPLASH',
  MAIN = 'MAIN',
  ADMIN = 'ADMIN',
  DIRECTORY = 'DIRECTORY',
  MENUS = 'MENUS',
  REQUEST_FORMS = 'REQUEST_FORMS',
  CAMPUS_INFO = 'CAMPUS_INFO',
  DOIG_HEALTH_CLUB = 'DOIG_HEALTH_CLUB'
}

export type AdminTab = 'COMMUNITY' | 'DOCUMENTS' | 'DIRECTORY' | 'SYSTEM';
