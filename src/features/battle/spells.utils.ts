import type { SpellTier } from "../../types/game";

export function getSpellTier(streak: number): SpellTier {
  if (streak >= 8) return "mega";
  if (streak >= 5) return "lightning";
  if (streak >= 3) return "fireball";
  return "none";
}

export function getSpellBonusDamage(spell: SpellTier): number {
  if (spell === "fireball") return 1;
  if (spell === "lightning") return 2;
  if (spell === "mega") return 4;
  return 0;
}

export function getSpellLabel(spell: SpellTier): string {
  if (spell === "fireball") return "🔥 Fireball!";
  if (spell === "lightning") return "⚡ Lightning!";
  if (spell === "mega") return "🌟 Mega Spell!";
  return "";
}
