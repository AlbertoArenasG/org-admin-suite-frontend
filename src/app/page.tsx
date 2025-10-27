import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
      <div className="max-w-xl space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
          Org Admin Suite
        </p>
        <h1 className="text-4xl font-semibold">Centraliza la operación de tu organización</h1>
        <p className="text-base text-muted-foreground">
          Gestiona usuarios, servicios y encuestas desde un único panel. Utiliza el enlace de login
          para acceder al dashboard protegido o comparte los enlaces públicos generados por la
          plataforma.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white sm:w-auto"
            href="/login"
          >
            Ir al login
          </Link>
          <Link
            className="w-full rounded-md border px-4 py-2 text-sm font-medium text-slate-900 sm:w-auto"
            href="/public/surveys/demo"
          >
            Explorar enlace público
          </Link>
        </div>
      </div>
    </main>
  );
}
