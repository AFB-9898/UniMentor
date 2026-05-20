import { z } from "zod";

/**
 * Session booking schema — validates the session creation form.
 */
export const sessionFormSchema = z.object({
  mentorId: z.string().min(1, "Seleccioná un mentor"),
  topic: z
    .string()
    .min(5, "El tema debe tener al menos 5 caracteres")
    .max(200, "El tema no puede superar los 200 caracteres"),
  date: z.string().min(1, "Seleccioná una fecha"),
  notes: z.string().max(500, "Las notas no pueden superar los 500 caracteres").optional(),
});

export type SessionFormData = z.infer<typeof sessionFormSchema>;
