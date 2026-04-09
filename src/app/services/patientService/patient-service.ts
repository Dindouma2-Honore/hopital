import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Patient, PatientStatus } from '../../core/models/hospital.models';
import { raw } from 'express';

export interface PatientBD {
  matricule:    string;      // → id
  nom:          string;      // → lastName
  prenom:       string;      // → firstName
  age:          number;      // → age
  sexe:         string;      // → gender  (ex: "M" ou "F" ou "Masculin"/"Féminin")
  bloodGroup:   string;      // → bloodGroup
  departement:  string;      // → department
  docteur:      string;      // → doctor
  status:       string;      // → status
  admissionDate:string;      // → admissionDate
  phone?:       string;      // → phone
  allergie?:    string;      // → allergies  (chaîne séparée par virgule ex: "Pénicilline,Aspirine")
  condition?:   string;      // → conditions (chaîne séparée par virgule)
  salle?:       string;      // → room
  photo?:       string;      // → color (on génère une couleur à partir de la photo ou du matricule)
}
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiPatient;

  // ── Couleurs prédéfinies assignées selon l'index ──────────
  private readonly COLORS = [
    '#00c2a8','#635bff','#ffa502','#ff4757',
    '#8e44ad','#16a085','#e67e22','#1abc9c',
    '#e74c3c','#2980b9','#f39c12','#27ae60',
  ];

  // ── Convertit un sexe textuel en 'M' | 'F' ───────────────
  private parseGender(sexe: string): 'M' | 'F' {
    const s = sexe?.toLowerCase().trim();
    if (s === 'm' || s === 'masculin' || s === 'male' || s === 'homme') return 'M';
    return 'F';
  }

  // ── Convertit le status de la BD en PatientStatus Angular ─
  private parseStatus(status: string): PatientStatus {
    const s = status?.toLowerCase().trim();
    if (s === 'hospitalisé' || s === 'hospitalise' || s === 'inpatient') return 'Hospitalisé';
    if (s === 'ambulatoire' || s === 'outpatient')                        return 'Ambulatoire';
    if (s === 'sorti'       || s === 'discharged' || s==='dechargé' || s==='decharge')       return 'Sorti';
    if (s === 'urgence'     || s === 'urgences'   || s === 'emergency')   return 'Urgence';
    return 'Hospitalisé'; // valeur par défaut si inconnu
  }

  // ── Convertit une chaîne "val1,val2" en tableau ["val1","val2"] ─
  private parseList(value: string | undefined): string[] | undefined {
    if (!value || value.trim() === '') return undefined;
    return value.split(',').map(v => v.trim()).filter(v => v !== '');
  }

  // ── Méthode publique : récupère et transforme les patients ─
  getPatients(): Observable<Patient[]> {
    return this.http
      .get<Patient[]>(this.apiUrl)         // 1. Récupère PatientBD[] depuis PHP
      
  }
   // ── POST — Ajouter un nouveau patient ─────────────────────
  // Envoie les données au format BD vers ton API PHP
  addPatient(patient:Patient): Observable<Patient> {
    
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  // ── PUT — Modifier un patient existant ────────────────────
  // URL : /patients/{matricule}
  updatePatient(id: string, patient: Patient): Observable<Patient> {
   
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  // ── DELETE — Supprimer un patient ─────────────────────────
  // URL : /patients/{matricule}
 deletePatient(id: number) {
  return this.http.delete(`${this.apiUrl}?id=${id}`);
}
}
