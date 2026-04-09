// ============================================================
// src/app/core/models/hospital.models.ts
// Central type definitions for MediCore Pro
// ============================================================

export type PatientStatus = 'Hospitalisé' | 'Ambulatoire' | 'Sorti' | 'Urgence';
export type UrgencyPriority = 'Critique' | 'Urgent' | 'Standard';
export type RoomStatus = 'occupied' | 'free' | 'maintenance' | 'icu';
export type DoctorStatus = 'Disponible' | 'En consultation' | 'En congé' | 'En opération';
export type AppointmentStatus = 'Confirmé' | 'En attente' | 'Annulé';
export type OperationStatus = 'Terminée' | 'En cours' | 'Planifiée' | 'Libre';
export type StockStatus = 'OK' | 'Bas' | 'Rupture' | 'Critique';

export interface Patient {
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  age: number;
  sexe: 'M' | 'F';
  bloodGroup: string;
  departement: string;
  docteur: string;
  status: PatientStatus;
  admissionDate: string;
  phone?: string;
  allergie?: string[];
  condition?: string[];
  color?: string | null;
  salle?: string;
  photo?: string;
}

export interface Doctor {
  
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  specialite: string;
  status: DoctorStatus;
  
  experience: string;
  phone: string;
  email: string;
  color: string;
}

export interface Department {
  numero?:number
  id: string;
  nom: string;
  icon: string;
  nombreStaff: number;
  nombreLit: number;
  occupation: number;
  color?: string;
  bgColor?: string;
  headDoctor?: string;
}

export interface Appointment {
  numero?:number
  id: string;
  patient: string;
  docteur: string;
  specialite: string;
  date: string;
  heure: string;
  type: string;
  status: AppointmentStatus;
  color: string;
  note?: string;
}
export interface Consultation {
  numero?:number
  id: string;
  
  patient: string;
 
  medecin: string;
  specialite: string;
  date: string;
  heure: string;
  motif: string;
  diagnostic: string;
  note: string;
  status: 'En cours' | 'Terminée' | 'Planifiée' | 'Annulée';
  type: 'Première visite' | 'Contrôle' | 'Urgence' | 'Suivi';
  
  color: string;
}
export interface MedicationLine {
  produit: string;
  posologie: string;
  frequence: string;
  duree: string;
  quantite: string;
  warning?: string;
}
export interface Ordonnance {
  numero?:number
  id: string;
  idConsultation: string;
  patient: string;
  
  prescripteur: string;
  
  date: string;
  validite: string;
  status: 'Active' | 'Expirée' | 'Délivrée' | 'Annulée';
  medicament: MedicationLine[];
  note: string;
  color?: string;
}
export interface ListeMedicament{
   produit: string;
  dosage: string;
  prescripteur: string;
  frequence: string;
  debut: string;
  warning?:string
 
  
}
export interface Dossier{
  numero?: number;
  id: string;
  patient: string;
  frequence:string
  temperature:string;
  tension:string;
  spo2:string
  age: number;
  sexe: 'M' | 'F';
  bloodGroup: string;
  medicament: ListeMedicament[];
  departement: string;
  antecedent: string;
  allergie?: string[];
  color?:string
 
}
export interface Room {
  numero?:number,
  id: string;
  etage: number;
  status: RoomStatus;
  patient?: string;
  
}
export interface Etage {
  numero?:number,
  id: number;
  nom: string;
  service: RoomStatus;
 
  
}

export interface UrgencyCase {
  numero?:number
  id: string;
  patient: string;
  priorite: UrgencyPriority;
  raison: string;
  heureArrive: string;
  docteur: string;
  status: string;
  color?: string;
  initials?: string;
}

export interface Operation {
  id?:number;
  bloc: string;
  patient: string;
  intervention: string;
  chirurgien: string;
  heureDebut: string;
  duree: string;
  status: OperationStatus;
}

export interface LabTest {
  numero?:number;
  id: string;
  patient: string;
  type: string;
  prescripteur: string;
  heure: string;
  status: 'Prêt' | 'En cours' | 'Attente' | '48h';
}

export interface LabResult {
  numero?:number
  patient:string;
  nom: string;
  valeur: string;
  unite: string;
  reference: string;
  status: 'Normal' | 'Haut' | 'Faible' | 'Critique';
}

export interface Medicine {
  numero?:number;
  reference: string;
  nom: string;
  generique: string;
  stock: number;
  minStock: number;
  unite: string;
  categorie: string;
  isOk: boolean;
}

export interface Invoice {
  numero?:number
  reference: string;
  patient: string;
  service: string;
  montant: number;
  status: 'Payée' | 'En attente' | 'Impayée';
  date: string;
}

export interface StockItem {
  ref: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  location: string;
  status: StockStatus;
}

export interface StaffSchedule {
  name: string;
  role: string;
  department: string;
  schedule: Record<string, 'M' | 'S' | 'N' | 'C' | 'Congé'>;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  activeEmergencies: number;
  bedOccupancyRate: number;
  weeklyConsultations: number;
  weeklySurgeries: number;
  weeklyDischarges: number;
}

export interface WeeklyData {
  day: string;
  value: number;
}

export interface Notification {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface IaMessage {
  text: string;
  role: 'bot' | 'user';
  time: string;
}
