import { createAccessControl } from "better-auth/plugins/access";

// ── Resources & actions ───────────────────────────────────────
// Définit ce qu'on peut faire sur chaque ressource du système.
const statement = {
   equipment: ["create", "read", "update", "delete"],
   categories: ["create", "read", "update", "delete"],
   reservations: ["create", "read", "update", "delete", "approve", "reject"],
   users: ["create", "read", "update", "delete", "ban", "set-role"],
} as const;

export const ac = createAccessControl(statement);

// ── Rôles ──────────────────────────────────────────────────────
// user  → accès limité : lire le catalogue, gérer ses résas
// admin → accès total à tout
export const userRole = ac.newRole({
   equipment: ["read"],
   reservations: ["create", "read"],
   categories: ["read"],
});

export const adminRole = ac.newRole({
   equipment: ["create", "read", "update", "delete"],
   categories: ["create", "read", "update", "delete"],
   reservations: ["create", "read", "update", "delete", "approve", "reject"],
   users: ["create", "read", "update", "delete", "ban", "set-role"],
});

// Exporté pour le client-side (adminClient)
export const roles = {
   admin: adminRole,
   user: userRole,
} as const;
