import { Logo } from '@/components/logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[100]">
      <div className="relative flex items-center justify-center">
        {/* Pulsing background glow */}
        <div className="absolute h-24 w-24 bg-accent/30 rounded-full blur-2xl animate-pulse" />
        
        {/* Logo with its own subtle animation */}
        <div className="animate-pulse">
            <Logo />
        </div>
      </div>
    </div>
  );
}
