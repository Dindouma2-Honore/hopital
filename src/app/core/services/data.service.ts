// ============================================================
// src/app/core/services/data.service.ts
// Mock data service — replace with real HTTP calls
// ============================================================
import { Injectable, signal, computed } from '@angular/core';
import {
  Patient, Doctor, Department, Appointment, Room, UrgencyCase,
  Operation, LabTest, LabResult, Medicine, Invoice, StockItem,
  StaffSchedule, DashboardStats, WeeklyData, Notification
} from '../models/hospital.models';

@Injectable({ providedIn: 'root' })
export class DataService {

  // ── Patients ────────────────────────────────────────────────
  // readonly patients = signal<Patient[]>([
  //   { id:'#P001', firstName:'Marie',   lastName:'Dubois',   age:45, gender:'F', bloodGroup:'A+', department:'Cardiologie', doctor:'Dr. Kamga',  status:'Hospitalisé', admissionDate:'15/03/26', color:'#00c2a8', allergies:['Pénicilline'], conditions:['HTA','Diabète T2'], room:'101' },
  //   { id:'#P002', firstName:'Jean',    lastName:'Mballa',   age:38, gender:'M', bloodGroup:'O+', department:'Neurologie',  doctor:'Dr. Simo',   status:'Ambulatoire', admissionDate:'16/03/26', color:'#635bff' },
  //   { id:'#P003', firstName:'Paul',    lastName:'Atangana', age:8,  gender:'M', bloodGroup:'B+', department:'Pédiatrie',   doctor:'Dr. Foe',    status:'Hospitalisé', admissionDate:'17/03/26', color:'#ffa502' },
  //   { id:'#P004', firstName:'Sara',    lastName:'Ndongo',   age:29, gender:'F', bloodGroup:'AB-',department:'Urgences',    doctor:'Dr. Biya',   status:'Urgence',     admissionDate:'19/03/26', color:'#ff4757' },
  //   { id:'#P005', firstName:'Luc',     lastName:'Essama',   age:62, gender:'M', bloodGroup:'O-', department:'Chirurgie',   doctor:'Dr. Owona',  status:'Hospitalisé', admissionDate:'14/03/26', color:'#8e44ad' },
  //   { id:'#P006', firstName:'Agnès',   lastName:'Fouda',    age:55, gender:'F', bloodGroup:'A+', department:'Urgences',    doctor:'Dr. Kamga',  status:'Urgence',     admissionDate:'19/03/26', color:'#ff4757' },
  //   { id:'#P007', firstName:'Pierre',  lastName:'Tchoua',   age:41, gender:'M', bloodGroup:'B-', department:'Chirurgie',   doctor:'Dr. Owona',  status:'Hospitalisé', admissionDate:'18/03/26', color:'#e67e22' },
  //   { id:'#P008', firstName:'Hélène',  lastName:'Zang',     age:33, gender:'F', bloodGroup:'A-', department:'Oncologie',   doctor:'Dr. Mvogo',  status:'Ambulatoire', admissionDate:'12/03/26', color:'#1abc9c' },
  //   { id:'#P009', firstName:'Robert',  lastName:'Abanda',   age:70, gender:'M', bloodGroup:'O+', department:'Neurologie',  doctor:'Dr. Simo',   status:'Hospitalisé', admissionDate:'10/03/26', color:'#635bff' },
  //   { id:'#P010', firstName:'Claire',  lastName:'Mengue',   age:52, gender:'F', bloodGroup:'AB+',department:'Cardiologie', doctor:'Dr. Kamga',  status:'Sorti',       admissionDate:'13/03/26', color:'#00c2a8' },
  // ]);

  // ── Doctors ─────────────────────────────────────────────────
  // readonly doctors = signal<Doctor[]>([
  //   { id:'D01', initials:'KA', firstName:'Kamga',  lastName:'André',   specialty:'Cardiologie', status:'Disponible',       patientCount:18, experience:'12 ans', phone:'+237 699 11 22 33', email:'kamga@hgy.cm',  color:'#e74c3c' },
  //   { id:'D02', initials:'SC', firstName:'Simo',   lastName:'Claude',  specialty:'Neurologie',  status:'En consultation',  patientCount:12, experience:'8 ans',  phone:'+237 699 44 55 66', email:'simo@hgy.cm',   color:'#635bff' },
  //   { id:'D03', initials:'FM', firstName:'Foe',    lastName:'Marie',   specialty:'Pédiatrie',   status:'En congé',         patientCount:24, experience:'15 ans', phone:'+237 699 77 88 99', email:'foe@hgy.cm',    color:'#27ae60' },
  //   { id:'D04', initials:'BP', firstName:'Biya',   lastName:'Paul',    specialty:'Urgences',    status:'Disponible',       patientCount:9,  experience:'6 ans',  phone:'+237 699 11 00 22', email:'biya@hgy.cm',   color:'#ff4757' },
  //   { id:'D05', initials:'OJ', firstName:'Owona',  lastName:'Jean',    specialty:'Chirurgie',   status:'En opération',     patientCount:7,  experience:'20 ans', phone:'+237 699 33 44 55', email:'owona@hgy.cm',  color:'#8e44ad' },
  //   { id:'D06', initials:'MS', firstName:'Mvogo',  lastName:'Sara',    specialty:'Oncologie',   status:'Disponible',       patientCount:15, experience:'10 ans', phone:'+237 699 66 77 88', email:'mvogo@hgy.cm',  color:'#16a085' },
  //   { id:'D07', initials:'NH', firstName:'Njock',  lastName:'Henri',   specialty:'Radiologie',  status:'Disponible',       patientCount:22, experience:'9 ans',  phone:'+237 699 99 00 11', email:'njock@hgy.cm',  color:'#f39c12' },
  //   { id:'D08', initials:'EA', firstName:'Ekwe',   lastName:'Anne',    specialty:'Radiologie',  status:'En consultation',  patientCount:11, experience:'5 ans',  phone:'+237 699 22 33 44', email:'ekwe@hgy.cm',   color:'#e67e22' },
  // ]);

  // ── Departments ─────────────────────────────────────────────
  // readonly departments = signal<Department[]>([
  //   { id:'DEP01', name:'Cardiologie',   icon:'❤️',  staffCount:12, bedCount:45,  occupancyRate:82, color:'#e74c3c', bgColor:'rgba(231,76,60,.1)' },
  //   { id:'DEP02', name:'Neurologie',    icon:'🧠',  staffCount:8,  bedCount:30,  occupancyRate:70, color:'#635bff', bgColor:'rgba(99,91,255,.1)' },
  //   { id:'DEP03', name:'Pédiatrie',     icon:'👶',  staffCount:15, bedCount:40,  occupancyRate:90, color:'#27ae60', bgColor:'rgba(39,174,96,.1)' },
  //   { id:'DEP04', name:'Chirurgie',     icon:'⚕️',  staffCount:20, bedCount:60,  occupancyRate:78, color:'#8e44ad', bgColor:'rgba(142,68,173,.1)' },
  //   { id:'DEP05', name:'Urgences',      icon:'🚨',  staffCount:18, bedCount:25,  occupancyRate:96, color:'#ff4757', bgColor:'rgba(255,71,87,.1)' },
  //   { id:'DEP06', name:'Oncologie',     icon:'🔬',  staffCount:10, bedCount:35,  occupancyRate:65, color:'#16a085', bgColor:'rgba(22,160,133,.1)' },
  //   { id:'DEP07', name:'Radiologie',    icon:'📡',  staffCount:7,  bedCount:0,   occupancyRate:0,  color:'#f39c12', bgColor:'rgba(243,156,18,.1)' },
  //   { id:'DEP08', name:'Laboratoire',   icon:'🧪',  staffCount:9,  bedCount:0,   occupancyRate:0,  color:'#2980b9', bgColor:'rgba(41,128,185,.1)' },
  //   { id:'DEP09', name:'Réanimation',   icon:'💉',  staffCount:16, bedCount:20,  occupancyRate:95, color:'#c0392b', bgColor:'rgba(192,57,43,.1)' },
  //   { id:'DEP10', name:'Gynécologie',   icon:'🌸',  staffCount:11, bedCount:28,  occupancyRate:71, color:'#e91e8c', bgColor:'rgba(233,30,140,.1)' },
  //   { id:'DEP11', name:'Orthopédie',    icon:'🦴',  staffCount:8,  bedCount:32,  occupancyRate:75, color:'#795548', bgColor:'rgba(121,85,72,.1)' },
  //   { id:'DEP12', name:'Ophtalmologie', icon:'👁️',  staffCount:5,  bedCount:15,  occupancyRate:53, color:'#00bcd4', bgColor:'rgba(0,188,212,.1)' },
  // ]);

  // ── Appointments ────────────────────────────────────────────
  // readonly appointments = signal<Appointment[]>([
  //   { id:'RDV01', patientName:'Marie Dubois',   doctorName:'Dr. Kamga',  specialty:'Cardiologie', date:'19/03/26', time:'08:30', type:'Consultation', status:'Confirmé',   color:'#00c2a8' },
  //   { id:'RDV02', patientName:'Jean Mballa',    doctorName:'Dr. Simo',   specialty:'Neurologie',  date:'19/03/26', time:'09:15', type:'Contrôle',     status:'Confirmé',   color:'#635bff' },
  //   { id:'RDV03', patientName:'Paul Atangana',  doctorName:'Dr. Foe',    specialty:'Pédiatrie',   date:'19/03/26', time:'10:00', type:'Consultation', status:'En attente', color:'#ffa502' },
  //   { id:'RDV04', patientName:'Sara Ndongo',    doctorName:'Dr. Biya',   specialty:'Urgences',    date:'19/03/26', time:'11:30', type:'Urgence',      status:'Confirmé',   color:'#ff4757' },
  //   { id:'RDV05', patientName:'Luc Essama',     doctorName:'Dr. Owona',  specialty:'Chirurgie',   date:'19/03/26', time:'14:00', type:'Chirurgie',    status:'Confirmé',   color:'#8e44ad' },
  //   { id:'RDV06', patientName:'Robert Abanda',  doctorName:'Dr. Simo',   specialty:'Neurologie',  date:'19/03/26', time:'15:30', type:'Contrôle',     status:'En attente', color:'#635bff' },
  //   { id:'RDV07', patientName:'Hélène Zang',    doctorName:'Dr. Mvogo',  specialty:'Oncologie',   date:'19/03/26', time:'16:45', type:'Consultation', status:'Confirmé',   color:'#16a085' },
  // ]);

  // ── Urgency Cases ───────────────────────────────────────────
  // readonly urgencyCases = signal<UrgencyCase[]>([
  //   { id:'#U001', patientName:'Emmanuel Nkoa', priority:'P1-Critique', reason:'Infarctus suspect',      arrivalTime:'08:12', doctor:'Dr. Kamga', status:'En cours',    color:'#ff4757', initials:'EN' },
  //   { id:'#U002', patientName:'Agnès Fouda',   priority:'P1-Critique', reason:'AVC — perte conscience', arrivalTime:'08:45', doctor:'Dr. Simo',  status:'Urgent',      color:'#ff4757', initials:'AF' },
  //   { id:'#U003', patientName:'Pierre Tchoua', priority:'P2-Urgent',   reason:'Fracture ouverte',       arrivalTime:'09:10', doctor:'Dr. Owona', status:'Attente scan', color:'#ffa502', initials:'PT' },
  //   { id:'#U004', patientName:'Sara Ndongo',   priority:'P3-Standard', reason:'Douleurs abdominales',   arrivalTime:'09:30', doctor:'Dr. Biya',  status:'En attente',  color:'#635bff', initials:'SN' },
  // ]);

  // ── Operations ──────────────────────────────────────────────
  // readonly operations = signal<Operation[]>([
  //   { bloc:'Bloc A', patient:'M. Essomba',  intervention:'Appendicectomie',      surgeon:'Dr. Owona', startTime:'07:30', duration:'1h30', status:'Terminée' },
  //   { bloc:'Bloc B', patient:'C. Mengue',   intervention:'Pontage coronarien',   surgeon:'Dr. Kamga', startTime:'09:00', duration:'4h00', status:'En cours' },
  //   { bloc:'Bloc C', patient:'R. Abanda',   intervention:'Hernie discale',       surgeon:'Dr. Simo',  startTime:'10:30', duration:'2h30', status:'En cours' },
  //   { bloc:'Bloc D', patient:'H. Nkono',    intervention:'Cholécystectomie',     surgeon:'Dr. Foe',   startTime:'13:00', duration:'1h00', status:'Planifiée' },
  //   { bloc:'Bloc E', patient:'T. Bitchong', intervention:'Arthroplastie hanche', surgeon:'Dr. Mvogo', startTime:'14:30', duration:'3h00', status:'Planifiée' },
  //   { bloc:'Bloc F', patient:'—',           intervention:'Disponible',           surgeon:'—',         startTime:'—',     duration:'—',    status:'Libre' },
  // ]);

  // ── Lab Tests ───────────────────────────────────────────────
  // readonly labTests = signal<LabTest[]>([
  //   { id:'#L1201', patient:'M. Dubois',   type:'NFS complète',    prescriber:'Dr. Kamga', time:'07:45', status:'Prêt' },
  //   { id:'#L1202', patient:'J. Mballa',   type:'Bilan lipidique', prescriber:'Dr. Simo',  time:'08:20', status:'En cours' },
  //   { id:'#L1203', patient:'P. Atangana', type:'Glycémie',        prescriber:'Dr. Foe',   time:'09:00', status:'Prêt' },
  //   { id:'#L1204', patient:'A. Fouda',    type:'Coagulation',     prescriber:'Dr. Biya',  time:'09:30', status:'Attente' },
  //   { id:'#L1205', patient:'L. Essama',   type:'Culture bactér.', prescriber:'Dr. Owona', time:'10:00', status:'48h' },
  // ]);

  // readonly labResults = signal<LabResult[]>([
  //   { name:'Hémoglobine', value:'14.2', unit:'g/dL',   reference:'12-17',   status:'normal' },
  //   { name:'Leucocytes',  value:'12.8', unit:'G/L',    reference:'4.5-11',  status:'high' },
  //   { name:'Plaquettes',  value:'245',  unit:'G/L',    reference:'150-400', status:'normal' },
  //   { name:'Glycémie',    value:'6.8',  unit:'mmol/L', reference:'3.9-6.1', status:'high' },
  //   { name:'Créatinine',  value:'82',   unit:'µmol/L', reference:'62-115',  status:'normal' },
  //   { name:'CRP',         value:'48',   unit:'mg/L',   reference:'<5',      status:'critical' },
  // ]);

  // ── Medicines ───────────────────────────────────────────────
  // readonly medicines = signal<Medicine[]>([
  //   { id:'M01', name:'Amoxicilline 500mg', generic:'Amoxicilline', stock:240,  minStock:100, unit:'boîtes',  category:'Antibiotique',  isOk:true },
  //   { id:'M02', name:'Paracétamol 1g',     generic:'Paracétamol',  stock:1200, minStock:500, unit:'boîtes',  category:'Antalgique',    isOk:true },
  //   { id:'M03', name:'Insuline Glargine',  generic:'Glargine',     stock:12,   minStock:50,  unit:'flacons', category:'Antidiabétique',isOk:false },
  //   { id:'M04', name:'Metformine 500mg',   generic:'Metformine',   stock:380,  minStock:100, unit:'boîtes',  category:'Antidiabétique',isOk:true },
  //   { id:'M05', name:'Ciprofloxacine IV',  generic:'Cipro',        stock:48,   minStock:60,  unit:'flacons', category:'Antibiotique',  isOk:false },
  //   { id:'M06', name:'Morphine 10mg/ml',   generic:'Morphine',     stock:92,   minStock:30,  unit:'ampoules',category:'Analgésique',   isOk:true },
  //   { id:'M07', name:'Amlodipine 5mg',     generic:'Amlodipine',   stock:650,  minStock:200, unit:'boîtes',  category:'Antihypert.',   isOk:true },
  //   { id:'M08', name:'Héparine 5000UI',    generic:'Héparine',     stock:200,  minStock:80,  unit:'ampoules',category:'Anticoag.',     isOk:true },
  // ]);

  // ── Invoices ────────────────────────────────────────────────
  // readonly invoices = signal<Invoice[]>([
  //   { id:'#F2601', patient:'M. Dubois',  services:'Hospit. + Pharma',  amount:185000, status:'Payée',      date:'19/03/26' },
  //   { id:'#F2602', patient:'J. Mballa',  services:'Chirurgie + Labo',  amount:420000, status:'En attente', date:'18/03/26' },
  //   { id:'#F2603', patient:'S. Ndongo',  services:'Consultation + Rx', amount:35000,  status:'Payée',      date:'19/03/26' },
  //   { id:'#F2604', patient:'P. Tchoua',  services:'Urgences + Scan',   amount:240000, status:'Impayée',    date:'17/03/26' },
  // ]);

  // ── Stock Items ─────────────────────────────────────────────
  readonly stockItems = signal<StockItem[]>([
    { ref:'#S001', name:'Seringues 5ml',   category:'Consommable', quantity:2450, minQuantity:500, location:'Entrepôt A',  status:'OK' },
    { ref:'#S002', name:'Gants stériles M',category:'Protection',  quantity:180,  minQuantity:200, location:'Entrepôt A',  status:'Bas' },
    { ref:'#S003', name:'Perfuseur IV',    category:'Consommable', quantity:0,    minQuantity:100, location:'—',           status:'Rupture' },
    { ref:'#S004', name:'Tensiomètre',     category:'Équipement',  quantity:24,   minQuantity:10,  location:'Service gén.',status:'OK' },
    { ref:'#S005', name:'Oxymètre',        category:'Équipement',  quantity:18,   minQuantity:15,  location:'USI',         status:'OK' },
    { ref:'#S006', name:'Masques FFP2',    category:'Protection',  quantity:45,   minQuantity:200, location:'Réserve',     status:'Critique' },
  ]);

  // ── Staff Schedules ─────────────────────────────────────────
  readonly staffSchedules = signal<StaffSchedule[]>([
    { name:'Dr. Kamga', role:'Cardiologue',   department:'Cardiologie', schedule:{ lun:'M', mar:'M', mer:'S', jeu:'M', ven:'M' } },
    { name:'Dr. Simo',  role:'Neurologue',    department:'Neurologie',  schedule:{ lun:'S', mar:'M', mer:'M', jeu:'S', ven:'M' } },
    { name:'Inf. Biloa',role:'Inf. Chef',     department:'Chirurgie',   schedule:{ lun:'M', mar:'M', mer:'M', jeu:'C', ven:'C' } },
    { name:'Dr. Foe',   role:'Pédiatre',      department:'Pédiatrie',   schedule:{ lun:'Congé', mar:'Congé', mer:'Congé', jeu:'Congé', ven:'Congé' } },
    { name:'Dr. Biya',  role:'Urgentiste',    department:'Urgences',    schedule:{ lun:'M', mar:'S', mer:'N', jeu:'M', ven:'S' } },
  ]);

  // ── Dashboard Stats ─────────────────────────────────────────
  readonly dashboardStats = signal<DashboardStats>({
    totalPatients: 248,
    todayAppointments: 42,
    activeEmergencies: 7,
    bedOccupancyRate: 83,
    weeklyConsultations: 1247,
    weeklySurgeries: 89,
    weeklyDischarges: 324,
  });

  readonly weeklyData = signal<WeeklyData[]>([
    { day:'Lun', value:180 }, { day:'Mar', value:220 },
    { day:'Mer', value:195 }, { day:'Jeu', value:240 },
    { day:'Ven', value:260 }, { day:'Sam', value:210 },
    { day:'Dim', value:235 },
  ]);

  // ── Notifications ───────────────────────────────────────────
  readonly notifications = signal<Notification[]>([
    { id:'N1', type:'danger',  title:'Bloc 3 — Urgence',   message:'Patient critique, chirurgien requis',  time:'Il y a 5 min',  read:false },
    { id:'N2', type:'warning', title:'Stock faible',        message:'Insuline Glargine — 12 unités',        time:'Il y a 20 min', read:false },
    { id:'N3', type:'warning', title:'Équipement',          message:'IRM 2 — maintenance 14h',              time:'Il y a 1h',     read:false },
    { id:'N4', type:'success', title:'Livraison reçue',     message:'Commande #4472 confirmée',             time:'Il y a 2h',     read:true  },
    { id:'N5', type:'danger',  title:'Vitales anormales',   message:'Chambre 212 — TA 180/110',             time:'Il y a 2h',     read:true  },
  ]);

  // ── Computed ─────────────────────────────────────────────────
  readonly unreadNotifications = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

  // readonly criticalPatients = computed(() =>
  //   this.patients().filter(p => p.status === 'Urgence')
  // );
}
