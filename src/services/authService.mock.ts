import type { User, Mentor, Student, UserRole } from "../types";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  university?: string;
  career?: string;
  specialty?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthService {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

interface MockUser {
  user: Mentor | Student;
  password: string;
}

const STORAGE_KEY = "unimentor_user";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

let currentUser: User | null = loadUser();

const mockUsers: MockUser[] = [
  {
    user: {
      id: "s1",
      name: "Abraham Estudiante",
      email: "student@test.com",
      role: "student",
      university: "UNSA",
      career: "Ingeniería de Software",
      createdAt: "2026-03-01",
    } as Student,
    password: "123456",
  },
  {
    user: {
      id: "1",
      name: "Carlos Mendoza",
      email: "carlos@ejemplo.com",
      role: "mentor",
      specialty: ["React", "TypeScript"],
      rating: 4,
      sessionCount: 23,
      createdAt: "2026-01-15",
    } as Mentor,
    password: "123456",
  },
  {
    user: {
      id: "2",
      name: "María García",
      email: "maria@ejemplo.com",
      role: "mentor",
      specialty: ["UX Design", "Figma"],
      rating: 5,
      sessionCount: 45,
      createdAt: "2025-11-20",
    } as Mentor,
    password: "123456",
  },
  {
    user: {
      id: "3",
      name: "Luis Torres",
      email: "luis@ejemplo.com",
      role: "mentor",
      specialty: ["Node.js", "PostgreSQL"],
      rating: 3,
      sessionCount: 12,
      createdAt: "2026-03-08",
    } as Mentor,
    password: "123456",
  },
];

function generateToken(): string {
  return `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildUser(data: RegisterData): Mentor | Student {
  const base = {
    id: `u${mockUsers.length + 1}`,
    name: data.name,
    email: data.email,
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (data.role === "student") {
    return {
      ...base,
      role: "student" as const,
      university: data.university ?? "",
      career: data.career ?? "",
    } as Student;
  }

  return {
    ...base,
    role: "mentor" as const,
    specialty: data.specialty ?? [],
    rating: 0,
    sessionCount: 0,
  } as Mentor;
}

export const mockAuthService: AuthService = {
  async login({ email, password }) {
    const found = mockUsers.find((u) => u.user.email === email);

    if (!found || found.password !== password) {
      throw new Error("Credenciales inválidas");
    }

    currentUser = found.user;
    saveUser(found.user);
    return { user: found.user, token: generateToken() };
  },

  async register(data) {
    const exists = mockUsers.find((u) => u.user.email === data.email);

    if (exists) {
      throw new Error("El email ya está registrado");
    }

    const newUser = buildUser(data);
    mockUsers.push({ user: newUser, password: data.password });
    currentUser = newUser;
    saveUser(newUser);

    return { user: newUser, token: generateToken() };
  },

  async logout() {
    currentUser = null;
    clearUser();
  },

  async getCurrentUser() {
    return currentUser;
  },
};
