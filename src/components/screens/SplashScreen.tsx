export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-gray-50 to-secondary/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <div className="text-center animate-fade-in px-6">
        {/* Real logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/favicon.png"
            alt="UniMentor"
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-3 tracking-tight">
          UniMentor
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-md mx-auto">
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
