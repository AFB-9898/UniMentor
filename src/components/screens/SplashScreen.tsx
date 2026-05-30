import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"entering" | "visible" | "leaving">("entering");

  useEffect(() => {
    // Start entering → visible after mount
    const enterTimer = setTimeout(() => setPhase("visible"), 50);
    return () => clearTimeout(enterTimer);
  }, []);

  const isLeaving = phase === "leaving";

  return (
    <div
      data-testid="splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 transition-opacity duration-700 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`text-center transition-all duration-700 ${
          phase === "entering"
            ? "opacity-0 scale-95"
            : "opacity-100 scale-100"
        }`}
      >
        <h1 className="text-5xl font-bold text-primary mb-4">UniMentor</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Encontrá al mentor ideal para tu futuro profesional
        </p>
        <div className="flex justify-center gap-2">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
