import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionFormSchema, type SessionFormData } from "../../shared/schemas/session.schema";
import Input from "../../shared/components/forms/Input";
import Select from "../../shared/components/forms/Select";
import type { Mentor } from "../../types";

type SessionBookingFormProps = {
  mentors: Mentor[];
  /** Si se pasa, preselecciona el mentor y oculta el selector */
  defaultMentorId?: string;
  /** Callback llamado con los datos validados del form */
  onSubmit: (data: SessionFormData) => void;
  /** Estado de envío para deshabilitar el botón */
  isSubmitting?: boolean;
};

/**
 * SessionBookingForm — Formulario de agendamiento con validación RHF + Zod.
 *
 * Dos modos:
 * - Con `defaultMentorId`: oculta el selector de mentores (útil desde BookingPage)
 * - Sin `defaultMentorId`: muestra selector completo de mentores
 */
export default function SessionBookingForm({
  mentors,
  defaultMentorId,
  onSubmit: externalOnSubmit,
  isSubmitting = false,
}: SessionBookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
  });

  // Seed mentorId when defaultMentorId is provided so Zod sees it on submit
  useEffect(() => {
    if (defaultMentorId) {
      setValue("mentorId", defaultMentorId);
    }
  }, [defaultMentorId, setValue]);

  function onSubmit(data: SessionFormData) {
    externalOnSubmit(data);
    reset();
  }

  const selectedMentor = defaultMentorId
    ? mentors.find((m) => m.id === defaultMentorId)
    : null;

  const mentorOptions = mentors.map((m) => ({
    value: m.id,
    label: `${m.name} — ${m.specialty.join(", ")}`,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
      noValidate
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        📅 Agendar Sesión
      </h2>

      {defaultMentorId && selectedMentor ? (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mentor
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
            {selectedMentor.name}
          </p>
          <input type="hidden" {...register("mentorId")} />
        </div>
      ) : (
        <Select
          label="Mentor"
          error={errors.mentorId?.message}
          options={mentorOptions}
          placeholder="Seleccioná un mentor..."
          registration={register("mentorId")}
        />
      )}

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
