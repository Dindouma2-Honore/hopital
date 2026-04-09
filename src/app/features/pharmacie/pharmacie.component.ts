// src/app/features/pharmacie/pharmacie.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Doctor, Medicine } from '../../core/models/hospital.models';
import { StaffService } from '../../services/Staff/staff-service';
import { PharmacieService } from '../../services/PharmacieService/pharmacie-service';
import { MouvementStockService } from '../../services/mouvementStockService/mouvement-stock';
import { CommandeService } from '../../services/CommandeService/commande-service';
import { NgClass } from '@angular/common';


type ModalType =
  | 'approvisionner'
  | 'sortie'
  | 'nouveau'
  | 'editMouvement'
  | 'deleteMouvement'
  | 'nouvelleCommande'
  | 'editCommande'
  | 'deleteCommande'
  | null;

export interface MouvementStock {
  numero?: number;
  id: string;
  medicineId: string;
  produit: string;
  type: 'Entrée' | 'Sortie';
  quantite: number;
  date: string;
  motif: string;
  responsable: string;
}

export interface Commande {
  numero?: number;
  numCommande?: string;
  fournisseur: string;
  medicaments: string;
  dateCommande: string;
  dateLivraison: string;
  montant: number;
  statut: 'En attente' | 'Confirmée' | 'En transit' | 'Livré' | 'Annulée';
}

@Component({
  selector: 'app-pharmacie',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './pharmacie.component.html',
  styleUrls: ['./pharmacie.component.scss']
})
export class PharmacieComponent implements OnInit {

  readonly data = inject(DataService);
  private docteurService = inject(StaffService);
  private produitService = inject(PharmacieService);
  private mouvementService = inject(MouvementStockService);
  private commandeService = inject(CommandeService);

  docteurs = signal<Doctor[]>([]);
  produits = signal<Medicine[]>([]);
  mouvements = signal<MouvementStock[]>([]);
  commandes = signal<Commande[]>([]);

  modalType = signal<ModalType>(null);
  selectedMedicine = signal<Medicine | null>(null);
  selectedMouvement = signal<MouvementStock | null>(null);
  selectedCommande = signal<Commande | null>(null);

  searchQuery = signal('');
  activeTab = signal<'stock' | 'mouvements' | 'commandes'>('stock');
  isSaving = signal(false);
  isDeleting = signal(false);

  Math = Math;

  formAppro = { quantite: 0, fournisseur: '', numCommande: '', motif: 'Réapprovisionnement régulier' };
  formSortie = { quantite: 0, motif: 'Délivrance patient', patient: '', prescripteur: '' };
  formNouv = this.emptyMedicineForm();

  formEditMouv: MouvementStock = this.emptyMouvementForm();
  formCommande: Omit<Commande, 'numero' | 'numCommande'> = this.emptyCommandeForm();
  formEditCommande: Commande = this.emptyCommandeFormFull();

  ngOnInit(): void {
    this.LoadDoctors();
    this.LoadProduit();
    this.LoadMouvements();
    this.LoadCommandes();
  }

  // ── PRODUITS ──────────────────────────────────────────────────────
  LoadProduit(): void {
    this.produitService.getProduits().subscribe({
      next: (value) => {
        this.produits.set(value.map(m => ({
          ...m,
          stock: Number(m.stock),
          minStock: Number(m.minStock),
          isOk: Number(m.stock) >= Number(m.minStock)
        })));
      },
      error: (err) => { console.log('Erreur produits', err); }
    });
  }

  AjouterProduit(): void {
    if (!this.formNouv.nom || !this.formNouv.generique) return;
    this.formNouv.isOk = this.formNouv.stock >= this.formNouv.minStock;
    this.isSaving.set(true);
    this.produitService.addProduit(this.formNouv).subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.LoadProduit(); },
      error: (err) => { this.isSaving.set(false); console.log('Erreur ajout produit', err); }
    });
  }

  emptyMedicineForm(): Medicine {
    return { reference: '', nom: '', generique: '', categorie: '', stock: 0, minStock: 0, unite: 'boîtes', isOk: true };
  }

  // ── MOUVEMENTS ────────────────────────────────────────────────────
  LoadMouvements(): void {
    this.mouvementService.getMouvements().subscribe({
      next: (data) => {
        this.mouvements.set(data.map(mv => ({
          ...mv,
          numero: Number(mv.numero),
          quantite: Number(mv.quantite),
          id: mv.id ?? 'M' + mv.numero
        })));
      },
      error: (err) => { console.log('Erreur mouvements', err); }
    });
  }

  openEditMouvement(mv: MouvementStock): void {
    this.formEditMouv = { ...mv };
    this.selectedMouvement.set(mv);
    this.modalType.set('editMouvement');
  }

  openDeleteMouvement(mv: MouvementStock): void {
    this.selectedMouvement.set(mv);
    this.modalType.set('deleteMouvement');
  }

  saveEditMouvement(): void {
    const mv = this.formEditMouv;
    if (!mv.numero || mv.quantite <= 0) return;
    this.isSaving.set(true);
    this.mouvementService.updateMouvement(mv.numero, mv).subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.LoadMouvements(); },
      error: (err) => { this.isSaving.set(false); console.log('Erreur update mouvement', err); }
    });
  }

  confirmDeleteMouvement(): void {
    const mv = this.selectedMouvement();
    if (!mv?.numero) return;
    this.isDeleting.set(true);
    this.mouvementService.deleteMouvement(mv.numero).subscribe({
      next: () => { this.isDeleting.set(false); this.closeModal(); this.LoadMouvements(); },
      error: (err) => { this.isDeleting.set(false); console.log('Erreur delete mouvement', err); }
    });
  }

  emptyMouvementForm(): MouvementStock {
    return { id: '', medicineId: '', produit: '', type: 'Entrée', quantite: 0, date: '', motif: '', responsable: '' };
  }
  // ==========Approvionner le produit===============
  validerAppro(): void {
    const med = this.selectedMedicine();
    if (!med || this.formAppro.quantite <= 0) return;
    this.isSaving.set(true);
    const mouvement: Omit<MouvementStock, 'numero' | 'id'> = {
      medicineId: med.reference, produit: med.nom, type: 'Entrée',
      quantite: this.formAppro.quantite,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      motif: this.formAppro.motif, responsable: 'Admin',
    };
    this.mouvementService.addMouvement(mouvement).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.LoadProduit();      // ← recharge depuis BDD
        this.LoadMouvements();
      },
      error: (err) => { this.isSaving.set(false); console.log('Erreur appro', err); }
    });
  }
  // ===========Delivrer le produit=================
  validerSortie(): void {
    const med = this.selectedMedicine();
    if (!med || this.formSortie.quantite <= 0 || this.formSortie.quantite > med.stock) return;
    this.isSaving.set(true);
    const mouvement: Omit<MouvementStock, 'numero' | 'id'> = {
      medicineId: med.reference, produit: med.nom, type: 'Sortie',
      quantite: this.formSortie.quantite,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      motif: this.formSortie.motif + (this.formSortie.patient ? ' — ' + this.formSortie.patient : ''),
      responsable: this.formSortie.prescripteur || 'Staff',
    };
    this.mouvementService.addMouvement(mouvement).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.LoadProduit();      // ← recharge depuis BDD
        this.LoadMouvements();
      },
      error: (err) => { this.isSaving.set(false); console.log('Erreur sortie', err); }
    });
  }

  // ── COMMANDES ─────────────────────────────────────────────────────
  LoadCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes.set(data.map(c => ({
          ...c,
          numero: Number(c.numero),
          montant: Number(c.montant)   // ← ce cast est indispensable
        })));
      },
      error: (err) => { console.log('Erreur commandes', err); }
    });
  }

  openNouvelleCommande(): void {
    this.formCommande = this.emptyCommandeForm();
    this.modalType.set('nouvelleCommande');
  }

  openEditCommande(c: Commande): void {
    this.formEditCommande = { ...c };
    this.selectedCommande.set(c);
    this.modalType.set('editCommande');
  }

  openDeleteCommande(c: Commande): void {
    this.selectedCommande.set(c);
    this.modalType.set('deleteCommande');
  }

  ajouterCommande(): void {
    if (!this.formCommande.fournisseur || !this.formCommande.medicaments) return;
    this.isSaving.set(true);
    this.commandeService.addCommande(this.formCommande).subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.LoadCommandes(); },
      error: (err) => { this.isSaving.set(false); console.log('Erreur ajout commande', err); }
    });
  }

  saveEditCommande(): void {
    const c = this.formEditCommande;
    if (!c.numero) return;
    this.isSaving.set(true);
    this.commandeService.updateCommande(c.numero, c).subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.LoadCommandes(); },
      error: (err) => { this.isSaving.set(false); console.log('Erreur update commande', err); }
    });
  }

  confirmDeleteCommande(): void {
    const c = this.selectedCommande();
    if (!c?.numero) return;
    this.isDeleting.set(true);
    this.commandeService.deleteCommande(c.numero).subscribe({
      next: () => { this.isDeleting.set(false); this.closeModal(); this.LoadCommandes(); },
      error: (err) => { this.isDeleting.set(false); console.log('Erreur delete commande', err); }
    });
  }

  emptyCommandeForm(): Omit<Commande, 'numero' | 'numCommande'> {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    return { fournisseur: '', medicaments: '', dateCommande: today, dateLivraison: '', montant: 0, statut: 'En attente' };
  }

  emptyCommandeFormFull(): Commande {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    return { numero: 0, numCommande: '', fournisseur: '', medicaments: '', dateCommande: today, dateLivraison: '', montant: 0, statut: 'En attente' };
  }

  statutClass(statut: string): string {
    const map: Record<string, string> = {
      'Livré': 'badge-success-mc',
      'En transit': 'badge-warning-mc',
      'Confirmée': 'badge-info-mc',
      'En attente': 'badge-secondary-mc',
      'Annulée': 'badge-danger-mc',
    };
    return map[statut] ?? 'badge-secondary-mc';
  }

  // ── UTILITAIRES ───────────────────────────────────────────────────
  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.produits().filter(m =>
      m.nom.toLowerCase().includes(q) || m.generique.toLowerCase().includes(q)
    );
  });

  readonly statsStock = computed(() => ({
    total: this.produits().length,
    rupture: this.produits().filter(m => m.stock === 0).length,
    alerte: this.produits().filter(m => m.stock > 0 && !m.isOk).length,
    ok: this.produits().filter(m => m.isOk).length,
  }));

  stockPct(m: Medicine): number {
    if (m.minStock === 0) return 100;
    return Math.min(100, Math.round(m.stock / m.minStock * 100));
  }

  openApprovisionner(m: Medicine): void {
    this.selectedMedicine.set(m);
    this.formAppro = { quantite: 0, fournisseur: '', numCommande: '', motif: 'Réapprovisionnement régulier' };
    this.modalType.set('approvisionner');
  }

  openSortie(m: Medicine): void {
    this.selectedMedicine.set(m);
    this.formSortie = { quantite: 0, motif: 'Délivrance patient', patient: '', prescripteur: '' };
    this.modalType.set('sortie');
  }

  openNouveauProduit(): void {
    this.formNouv = { ...this.emptyMedicineForm(), reference: 'MED-' + (this.produits().length + 1) };
    this.modalType.set('nouveau');
  }

  closeModal(): void {
    this.modalType.set(null);
    this.selectedMedicine.set(null);
    this.selectedMouvement.set(null);
    this.selectedCommande.set(null);
  }

  setTab(t: 'stock' | 'mouvements' | 'commandes'): void { this.activeTab.set(t); }

  LoadDoctors(): void {
    this.docteurService.getDocteur().subscribe({
      next: (data) => { this.docteurs.set(data); },
      error: (err) => { console.log('Erreur docteurs', err); }
    });
  }
}
