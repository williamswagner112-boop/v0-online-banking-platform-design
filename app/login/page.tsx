import { LoginForm } from '@/components/login-form';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your NextBank account</p>
          </div>

          <LoginForm />

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
