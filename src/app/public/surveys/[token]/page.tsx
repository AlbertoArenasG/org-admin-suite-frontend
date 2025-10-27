interface SurveyPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function PublicSurveyPage({ params }: SurveyPageProps) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
      <section className="w-full max-w-2xl space-y-4 rounded-lg border bg-white p-6 shadow">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Encuesta pública</h1>
          <p className="text-sm text-muted-foreground">
            Participa en la encuesta enviada por tu organización. Token de acceso:{' '}
            <span className="font-mono">{token}</span>
          </p>
        </header>
        <p className="text-sm text-muted-foreground">
          El formulario de preguntas se implementará en siguientes iteraciones. Aquí mostraremos el
          contenido dinámico de la encuesta de acuerdo al token recibido por email.
        </p>
      </section>
    </main>
  );
}
