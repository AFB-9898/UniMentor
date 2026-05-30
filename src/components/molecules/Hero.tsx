import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="w-full py-20 md:py-28 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Encontrá al mentor ideal para tu futuro profesional
        </h1>
        <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          Conectá con profesionales experimentados que te guiarán en tu carrera
          universitaria
        </p>
        <div className="mt-10">
          <Link
            to="/mentors"
            className="inline-block px-8 py-3 bg-primary text-white text-lg font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Explorar mentores
          </Link>
        </div>
      </div>
    </section>
  );
}
