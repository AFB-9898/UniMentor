const nameMap: Record<string, string> = {
  "student-1": "Ana López",
  "1": "Carlos Mendoza",
  "2": "María García",
  "3": "Luis Torres",
  "s1": "Abraham Estudiante",
};

export function getUserName(id: string): string {
  return nameMap[id] ?? "Usuario desconocido";
}
