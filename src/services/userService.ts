/**
 * UUID → display name mapping.
 * Covers all known DB seed users plus local mock-only users.
 */
const nameMap: Record<string, string> = {
  "a0000000-0000-0000-0000-000000000001": "Carlos Mendoza",
  "a0000000-0000-0000-0000-000000000002": "María García",
  "a0000000-0000-0000-0000-000000000003": "Luis Torres",
  "a0000000-0000-0000-0000-000000000004": "Abraham Flores",
  "a0000000-0000-0000-0000-000000000099": "Ana Martínez",
  "a0000000-0000-0000-0000-000000000098": "Roberto Sánchez",
  "a0000000-0000-0000-0000-000000000097": "Laura Vega",
  // Test fixture fallbacks
  "student-1": "Ana López",
  "mentor-1": "Carlos Mendoza",
  // Fallbacks for legacy mock IDs (in case localStorage has data with these)
  "s1": "Abraham Estudiante",
  "1": "Carlos Mendoza",
  "2": "María García",
  "3": "Luis Torres",
  "4": "Ana Martínez",
  "5": "Roberto Sánchez",
  "6": "Laura Vega",
};

export function getUserName(id: string): string {
  return nameMap[id] ?? "Usuario desconocido";
}
