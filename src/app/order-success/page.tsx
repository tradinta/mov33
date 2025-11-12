'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Ticket } from 'lucide-react';
import Link from 'next/link';

function ConfettiPiece({ id }: { id: number }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    setStyle({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -200}px`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      transform: `rotate(${Math.random() * 360}deg)`,
      animation: `fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s infinite`,
    });
  }, []);

  return <div className="absolute w-2 h-4" style={style}></div>;
}


export default function OrderSuccessPage() {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 8000);
        return () => clearTimeout(timer);
    }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          0% { top: -10%; opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
      <div className="relative overflow-hidden">
        {showConfetti && Array.from({ length: 150 }).map((_, i) => <ConfettiPiece key={i} id={i} />)}
        <div className="container mx-auto max-w-2xl text-center py-20 md:py-32">
            <CheckCircle className="mx-auto h-24 w-24 text-green-500 animate-in fade-in zoom-in-50 duration-500" />
            <h1 className="mt-8 font-headline text-4xl md:text-5xl font-extrabold">Order Successful!</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Thank you for your purchase. Your tickets are ready! A receipt has also been sent to your email.
            </p>
            
            <Card className="mt-12 text-left bg-card/50">
                <CardContent className="p-6">
                    <h3 className="font-poppins font-semibold mb-4">Order #MOV33-12345</h3>
                     <div className="space-y-2 text-muted-foreground">
                        <p><strong>Status:</strong> Confirmed</p>
                        <p><strong>Total:</strong> KES 10,000</p>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="font-poppins text-lg">
                    <Link href="/profile">
                        <Ticket className="mr-2 h-5 w-5" /> Go to Ticket Center
                    </Link>
                </Button>
                 <Button asChild variant="outline" size="lg" className="font-poppins">
                    <Link href="/shop">
                        <ShoppingBag className="mr-2 h-5 w-5" /> Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </>
  );
}
