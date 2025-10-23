import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { login, resetStatus } from '@/features/auth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useAppDispatch();
  const { status, error, successMessage } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(
    () => () => {
      dispatch(resetStatus());
    },
    [dispatch]
  );

  const onSubmit = handleSubmit(async (values) => {
    await dispatch(login(values));
  });

  const isLoading = status === 'loading' || isSubmitting;

  useEffect(() => {
    if (status === 'succeeded') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-sm">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage || error ? (
            <div className="mb-4 space-y-3">
              {successMessage ? (
                <Alert>
                  <CheckCircle2 className="size-4" />
                  <AlertTitle>Listo</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              ) : null}
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Ocurrió un problema</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="grid gap-6" noValidate>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  {...register('email', {
                    required: 'Ingresa tu correo electrónico',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingresa un correo válido',
                    },
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email ? (
                  <p className="text-sm text-destructive">
                    {errors.email.message ?? 'Ingresa un correo válido'}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Ingresa tu contraseña',
                    minLength: {
                      value: 6,
                      message: 'Tu contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password ? (
                  <p className="text-sm text-destructive">
                    {errors.password.message ?? 'Ingresa tu contraseña'}
                  </p>
                ) : null}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  Ingresando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
