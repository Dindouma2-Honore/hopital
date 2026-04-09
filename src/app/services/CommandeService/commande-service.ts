// src/app/services/CommandeService/commande.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../../features/pharmacie/pharmacie.component';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommandeService {

  private readonly API = environment.apiCommande;

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.API);
  }

  addCommande(commande: Omit<Commande, 'numero' | 'numCommande'>): Observable<{ message: string; numero: number; numCommande: string }> {
    return this.http.post<{ message: string; numero: number; numCommande: string }>(this.API, commande);
  }

  updateCommande(numero: number, commande: Commande): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API}?numero=${numero}`, commande);
  }

  deleteCommande(numero: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}?numero=${numero}`);
  }
}
