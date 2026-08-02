/**
 * Shared role definitions for INDYpendent Bytes.
 * These roles live in Clerk publicMetadata.role (or publicMetadata.roles array).
 *
 * Roles:
 *  - user     → default for anyone who signs up via Resource Discovery Agent
 *  - grower   → Independent growers / sellers (buyer-seller platform)
 *  - buyer    → Buyers on the aggregation platform
 *  - admin    → INDYpendent Bytes staff
 */

export const ROLES = {
  USER: "user",
  GROWER: "grower",
  BUYER: "buyer",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [ROLES.USER]: "Community Member",
  [ROLES.GROWER]: "Grower / Seller",
  [ROLES.BUYER]: "Buyer",
  [ROLES.ADMIN]: "Admin",
};

/**
 * Get the primary role from a Clerk user object.
 * Falls back to "user" if nothing is set.
 */
export function getPrimaryRole(user) {
  if (!user) return null;
  const meta = user.publicMetadata || {};
  if (meta.role && Object.values(ROLES).includes(meta.role)) {
    return meta.role;
  }
  if (Array.isArray(meta.roles) && meta.roles.length > 0) {
    return meta.roles[0];
  }
  return ROLES.USER;
}

export function hasRole(user, role) {
  if (!user) return false;
  const meta = user.publicMetadata || {};
  if (meta.role === role) return true;
  if (Array.isArray(meta.roles) && meta.roles.includes(role)) return true;
  return false;
}

export function isGrower(user) {
  return hasRole(user, ROLES.GROWER) || hasRole(user, ROLES.ADMIN);
}

export function isBuyer(user) {
  return hasRole(user, ROLES.BUYER) || hasRole(user, ROLES.ADMIN);
}
