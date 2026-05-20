import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionFormSchema, type SessionFormData } from "../../shared/schemas/session.schema";
import Input from "../../shared/components/forms/Input";
import Select from "../../shared/components/forms/Select";
import type { Mentor } from "../../types";

type SessionBookingFormProps = {
  mentors: Mentor[];
};

/**
 * SessionBookingForm — Formulario de agendamiento con validación.
 *
 * Demuestra el uso de React Hook Form + Zod + componentes reutilizables.
 */
export default function SessionBookingForm({ mentors }: SessionBookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
  });

  function onSubmit(data: SessionFormData) {
    alert(`Solicitud enviada:\nMentor: ${data.mentorId}\nTema: ${data.topic}\nFecha: ${data.date}`);
    reset();
  }

  const mentorOptions = mentors.map((m) => ({
    value: m.id,
    label: `${m.name} — ${m.specialty.join(", ")}`,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg border border-gray-200 space-y-4"
      noValidate
    >
      <h2 className="text-lg font-semibold mb-3">📅 Agendar Sesión</h2>

      <Select
        label="Mentor"
        error={errors.mentorId?.message}
        options={mentorOptions}
        placeholder="Seleccioná un mentor..."
        registration={register("mentorId")}
      />

      <Input
        label="Tema de la sesión"
        error={errors.topic?.message}
        placeholder="Ej: Consultoría sobre arquitectura React"
        registration={register("topic")}
      />

      <Input
        label="Fecha"
        type="date"
        error={errors.date?.message}
        registration={register("date")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Solicitar sesión"}
      </button>
    </form>
  );
}
