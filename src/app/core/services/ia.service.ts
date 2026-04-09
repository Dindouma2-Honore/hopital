// ============================================================
// src/app/core/services/ia.service.ts
// MediAI — Claude-powered hospital assistant
// ============================================================
import { Injectable, signal } from '@angular/core';
import { IaMessage } from '../models/hospital.models';

@Injectable({ providedIn: 'root' })
export class IaService {

  readonly messages = signal<IaMessage[]>([{
    role: 'bot',
    text: `👋 Bonjour Dr. Martin ! Je suis <strong>MediAI</strong>, votre assistant médical.<br><br>
Je peux vous aider avec :<br>
• 🔍 Recherche patients &amp; dossiers<br>
• 📊 Statistiques &amp; rapports<br>
• 💊 Vérification stocks pharmacie<br>
• 📅 Gestion planning &amp; RDV<br>
• ⚠️ Alertes critiques<br><br>
Comment puis-je vous aider ?`,
    time: '08:30'
  }]);

  readonly isTyping = signal(false);
  readonly isOpen   = signal(false);

  private readonly SYSTEM_PROMPT = `Tu es MediAI, assistant médical intelligent de l'Hôpital Général de Yaoundé, Cameroun. 
Tu aides les médecins et le personnel soignant. Réponds en français, de façon concise et professionnelle.
Utilise des emojis médicaux appropriés. Tu connais les données suivantes :
- 248 patients hospitalisés, 7 urgences actives (3 critiques), 83% occupation lits
- 42 RDV aujourd'hui, 58 médecins actifs, 16 départements
- Alertes stock : Insuline Glargine (12/50), Masques FFP2 (45/200), Ciprofloxacine IV (48/60)
- Bloc opératoire : 2 opérations en cours (Pontage coronarien, Hernie discale)`;

  private fallbackResponses: Record<string, string> = {
    'patients critiques': `🔴 <strong>Patients critiques :</strong><br>1. Emmanuel Nkoa — Infarctus (Bloc 3)<br>2. Agnès Fouda — AVC (USI)<br>3. Pierre Tchoua — Fracture ouverte<br><br>→ 3 cas nécessitent une attention immédiate.`,
    'stats': `📊 <strong>Statistiques 19/03/2026 :</strong><br>• Admissions : <strong>14</strong><br>• Consultations : <strong>42</strong><br>• Chirurgies : <strong>5</strong><br>• Sorties : <strong>8</strong><br>• Occupation lits : <strong>83%</strong>`,
    'stocks': `⚠️ <strong>Alertes stock :</strong><br>🔴 Insuline Glargine — 12/50 flacons<br>🟠 Ciprofloxacine IV — 48/60<br>🔴 Masques FFP2 — 45/200<br>🟠 Gants stériles — 180/200`,
    'rdv': `📅 <strong>Prochains RDV :</strong><br>• 10:00 Paul Atangana — Pédiatrie (Dr. Foe)<br>• 11:30 Sara Ndongo — Urgences (Dr. Biya)<br>• 14:00 Luc Essama — Chirurgie (Dr. Owona)`,
    'chambre': `🏥 <strong>Occupation des chambres :</strong><br>Étage 1 : 17/20 (85%)<br>Étage 2 : 14/18 (78%)<br>USI 3 : 11/12 (92%)<br>Total : 312/375 (83%)`,
    'médecin': `👨‍⚕️ <strong>Personnel disponible :</strong><br>✅ Dr. Kamga (Cardiologie)<br>✅ Dr. Biya (Urgences)<br>✅ Dr. Mvogo (Oncologie)<br>🔵 Dr. Simo (En consultation)<br>🟠 Dr. Owona (En opération)`,
  };

  toggle(): void { this.isOpen.update(v => !v); }
  close():  void { this.isOpen.set(false); }

  async sendMessage(text: string): Promise<void> {
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    this.messages.update(msgs => [...msgs, { role: 'user', text, time: now }]);
    this.isTyping.set(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: this.SYSTEM_PROMPT,
          messages: [{ role: 'user', content: text }]
        })
      });

      const data = await response.json();
      const reply = data.content?.map((c: { text?: string }) => c.text || '').join('') || this.getFallback(text);

      this.isTyping.set(false);
      this.messages.update(msgs => [...msgs, {
        role: 'bot',
        text: reply.replace(/\n/g, '<br>'),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      this.isTyping.set(false);
      this.messages.update(msgs => [...msgs, {
        role: 'bot',
        text: this.getFallback(text),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }

  private getFallback(input: string): string {
    const m = input.toLowerCase();
    for (const [key, response] of Object.entries(this.fallbackResponses)) {
      if (m.includes(key)) return response;
    }
    if (m.includes('bonjour') || m.includes('salut') || m.includes('hello')) {
      return '👋 Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    }
    return `🤔 Je peux vous renseigner sur :<br>• "patients critiques"<br>• "stats du jour"<br>• "stocks bas"<br>• "prochains rdv"<br>• "chambres libres"<br>• "médecins disponibles"`;
  }
}
