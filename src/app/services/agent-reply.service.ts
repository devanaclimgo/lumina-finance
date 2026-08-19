import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AgentService {
  reply(text: string): string {
    const canned = [
      "Thanks for reaching out! I've pulled up your account — everything looks healthy on our side. Let me dig into the details.",

      "Good question. Balances refresh every few hours, and pending card holds are reflected separately until they settle.",

      "I've noted that for you. You can also manage this yourself under Settings › Workspace at any time.",

      "I've escalated this to our finance-ops team. You'll get an update in this thread within one business day.",
    ];

    const pick = canned[Math.floor(Math.random() * canned.length)];

    return `${pick}${text.trim().endsWith("?") ? "" : " Let me know if anything else comes up."}`;
  }
}
