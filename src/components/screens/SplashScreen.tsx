export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950"
    >
      <div className="text-center animate-fade-in">
        {/* Graduation cap icon */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-20 h-20 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-primary mb-3 tracking-tight">
          UniMentor
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10">
          Encontrá al mentor ideal para tu futuro profesional
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-3">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:200ms]" />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
