const VALID_ROLES = ["importer", "exporter", "both"];

const normalizeRole = (role) => {
  if (typeof role !== "string") return null;

  const normalized = role.trim().toLowerCase();
  return VALID_ROLES.includes(normalized) ? normalized : null;
};

const canAccessRole = (userRole, requiredRole) => {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedRequiredRole = normalizeRole(requiredRole);

  if (!normalizedUserRole || !normalizedRequiredRole) return false;

  if (normalizedUserRole === "both") {
    return (
      normalizedRequiredRole === "importer" ||
      normalizedRequiredRole === "exporter"
    );
  }

  if (normalizedRequiredRole === "both") {
    return normalizedUserRole === "both";
  }

  return normalizedUserRole === normalizedRequiredRole;
};

export { VALID_ROLES, normalizeRole, canAccessRole };
