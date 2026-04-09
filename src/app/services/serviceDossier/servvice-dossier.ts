import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Dossier } from '../../core/models/hospital.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServviceDossier {
  private http    = inject(HttpClient);
  private baseUrl = environment.apiDossier; // ex: 'http://localhost/medicore/api/ordonnance.php'

  // ── GET ALL ───────────────────────────────────────────────
  getDossier(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(this.baseUrl);
  }

  // ── GET ONE ───────────────────────────────────────────────
  getDossierById(numero: number): Observable<Dossier> {
    return this.http.get<Dossier>(`${this.baseUrl}?numero=${numero}`);
  }

  // ── POST ──────────────────────────────────────────────────
  addDossier(dossier: Dossier): Observable<any> {
    return this.http.post(this.baseUrl, dossier);
  }

  // ── PUT ───────────────────────────────────────────────────
  updateDossier(numero: number, dossier: Dossier): Observable<any> {
    return this.http.put(`${this.baseUrl}?numero=${numero}`, dossier);
  }

  // ── DELETE ────────────────────────────────────────────────
  deleteDossier(numero: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?numero=${numero}`);
  }
}
