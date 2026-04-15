export const normalizeRole = (role) => (role ? role.toString().toLowerCase() : '')

export const hasAnyRole = (role, allowedRoles = []) => {
  if (!allowedRoles.length) {
    return true
  }
  return allowedRoles.map(normalizeRole).includes(normalizeRole(role))
}
