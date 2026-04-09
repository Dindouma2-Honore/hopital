import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Etage, Room, RoomStatus } from '../../core/models/hospital.models';
import {  RoomService } from '../../services/servicesSalle/salle-service';
import { ServiceEtage } from '../../services/servicesEtage/service-etage';



@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  private roomSvc  = inject(RoomService);
  private floorSvc = inject(ServiceEtage);

  // ── Données ───────────────────────────────────────────────
  salles  = signal<Room[]>([]);
  etages = signal<Etage[]>([]);

  // ── États UI ──────────────────────────────────────────────
  isLoading = signal(true);
  isSaving  = signal(false);
  errorMsg  = signal<string | null>(null);
  saveError = signal<string | null>(null);

  // ── Modals chambres ───────────────────────────────────────
  showModalAddRoom    = signal(false);
  showModalEditRoom   = signal(false);
  showModalDeleteRoom = signal(false);
  roomToEdit   = signal<Room | null>(null);
  roomToDelete = signal<Room | null>(null);

  // ── Modals étages ─────────────────────────────────────────
  showModalAddFloor    = signal(false);
  showModalEditFloor   = signal(false);
  showModalDeleteFloor = signal(false);
  floorToEdit   = signal<Etage | null>(null);
  floorToDelete = signal<Etage | null>(null);

  // ── Formulaires ───────────────────────────────────────────
  formAddRoom:  Room  = this.emptyRoom();
  formEditRoom: Room  = this.emptyRoom();
  formAddFloor:  Etage = this.emptyFloor();
  formEditFloor: Etage = this.emptyFloor();

  readonly statusList: RoomStatus[] = ['occupied', 'free', 'maintenance', 'icu'];
  private iconMap: Record<RoomStatus, string> = {
    occupied: '👤', free: '🟢', maintenance: '🔧', icu: '💉'
  };

  // ── Init ──────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadFloors();
    this.loadRooms();
  }

  // ── Chargements ───────────────────────────────────────────
  loadFloors(): void {
    this.floorSvc.getAllFloors().subscribe({
      next:  (data) => { this.etages.set(data); },
      error: (err)  => { console.error('Erreur étages', err); }
    });
  }

  loadRooms(): void {
    this.isLoading.set(true);
    this.roomSvc.getAllRooms().subscribe({
      next: (data) => { this.salles.set(data); this.isLoading.set(false); },
      error: (err) => {
        this.errorMsg.set(err.status === 0 ? 'Impossible de joindre le serveur.' : `Erreur ${err.status}`);
        this.isLoading.set(false);
      }
    });
  }

  // ── Chambres par étage ────────────────────────────────────
  roomsByFloor(floorId: number): Room[] {
    return this.salles().filter(r => Number(r.etage) === floorId);
  }

  // ── Stats par étage ───────────────────────────────────────
  floorStats(floorId: number) {
    const rooms = this.roomsByFloor(floorId);
    const total = rooms.length;
    const occ   = rooms.filter(r => r.status === 'occupied').length;
    return { total, occ, pct: total ? Math.round(occ / total * 100) : 0 };
  }

  // ── Stats globales ────────────────────────────────────────
  readonly totalRooms = computed(() => this.salles().length);
  readonly totalOcc   = computed(() => this.salles().filter(r => r.status === 'occupied').length);
  readonly totalFree  = computed(() => this.salles().filter(r => r.status === 'free').length);

  // ── Utilitaires ───────────────────────────────────────────
  icon(s: RoomStatus): string { return this.iconMap[s]; }
  occ(r: number, t: number): number { return t ? Math.round(r / t * 100) : 0; }

  badgeFloor(floorId: number): string {
    const pct = this.floorStats(floorId).pct;
    return pct > 89 ? 'badge-danger-mc' : pct > 70 ? 'badge-warning-mc' : 'badge-info-mc';
  }

  emptyRoom(): Room {
    return { id: '', etage: 0, status: 'free', patient: '' };
  }

  // emptyFloor(): Etage {
  //   return { id:0, nom:'',service:'occupée'};
  // }
  emptyFloor():Etage{
    return{
      id:0,nom:'medecine',service:'free'
    }
  }
  // ════════════════════════════════════════════════════════
  // CRUD CHAMBRES
  // ════════════════════════════════════════════════════════

  ouvrirModalAddRoom(): void {
    this.formAddRoom = this.emptyRoom();
    if (this.etages().length > 0) this.formAddRoom.etage = this.etages()[0].id;
    this.saveError.set(null);
    this.showModalAddRoom.set(true);
  }

  ajouterRoom(): void {
    this.isSaving.set(true);
    this.saveError.set(null);
    this.roomSvc.addRoom(this.formAddRoom).subscribe({
      next: () => { this.isSaving.set(false); this.showModalAddRoom.set(false); this.loadRooms(); },
      error: (err) => { this.isSaving.set(false); this.saveError.set(`Erreur : ${err.statusText}`); }
    });
  }

  ouvrirModalEditRoom(r: Room): void {
    this.formEditRoom = { ...r };
    this.roomToEdit.set(r);
    this.saveError.set(null);
    this.showModalEditRoom.set(true);
  }

  modifierRoom(): void {
    const r = this.roomToEdit();
    if (!r) return;
    this.isSaving.set(true);
    this.roomSvc.updateRoom(Number(r.numero), this.formEditRoom).subscribe({
      next: () => { this.isSaving.set(false); this.showModalEditRoom.set(false); this.loadRooms(); },
      error: (err) => { this.isSaving.set(false); this.saveError.set(`Erreur : ${err.statusText}`); }
    });
  }

  ouvrirModalDeleteRoom(r: Room): void {
    this.roomToDelete.set(r);
    this.showModalDeleteRoom.set(true);
  }

  supprimerRoom(): void {
    const r = this.roomToDelete();
    if (!r) return;
    this.isSaving.set(true);
    this.roomSvc.deleteRoom(Number(r.numero)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalDeleteRoom.set(false);
        this.roomToDelete.set(null);
        this.loadRooms();
      },
      error: (err) => { this.isSaving.set(false); console.error(err); }
    });
  }

  // ════════════════════════════════════════════════════════
  // CRUD ÉTAGES
  // ════════════════════════════════════════════════════════

  ouvrirModalAddFloor(): void {
    this.formAddFloor = this.emptyFloor();
    this.saveError.set(null);
    this.showModalAddFloor.set(true);
  }

  ajouterFloor(): void {
    this.isSaving.set(true);
    this.saveError.set(null);
    this.floorSvc.addFloor(this.formAddFloor).subscribe({
      next: () => { this.isSaving.set(false); this.showModalAddFloor.set(false); this.loadFloors(); },
      error: (err) => { this.isSaving.set(false); this.saveError.set(`Erreur : ${err.statusText}`); }
    });
  }

  ouvrirModalEditFloor(f: Etage): void {
    this.formEditFloor = { ...f };
    this.floorToEdit.set(f);
    this.saveError.set(null);
    this.showModalEditFloor.set(true);
  }

  modifierFloor(): void {
    const f = this.floorToEdit();
    if (!f) return;
    this.isSaving.set(true);
    this.floorSvc.updateFloor(Number(f.numero), this.formEditFloor).subscribe({
      next: () => { this.isSaving.set(false); this.showModalEditFloor.set(false); this.loadFloors(); },
      error: (err) => { this.isSaving.set(false); this.saveError.set(`Erreur : ${err.statusText}`); }
    });
  }

  ouvrirModalDeleteFloor(f: Etage): void {
    this.floorToDelete.set(f);
    this.showModalDeleteFloor.set(true);
  }

  supprimerFloor(): void {
    const f = this.floorToDelete();
    if (!f) return;
    this.isSaving.set(true);
    this.floorSvc.deleteFloor(Number(f.numero)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalDeleteFloor.set(false);
        this.floorToDelete.set(null);
        this.loadFloors();
        this.loadRooms();
      },
      error: (err) => { this.isSaving.set(false); console.error(err); }
    });
  }
}
