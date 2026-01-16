'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Ticket, Loader2, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';

function ConfettiPiece({ id }: { id: number }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const colors = ['#D4AF37', '#228B22', '#FF6B35', '#F7DC6F', '#1ABC9C'];
    setStyle({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -200}px`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      transform: `rotate(${Math.random() * 360}deg)`,
      animation: `fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s infinite`,
    });
  }, []);

  return <div className="absolute w-2 h-4 rounded-sm" style={style}></div>;
}

interface OrderData {
  id: string;
  contactName: string;
  contactEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant?: { name: string };
  }>;
  total: number;
  status: string;
  paymentGateway?: string;
  paidAt?: string;
  mpesaReceiptNumber?: string;
  paystackReceiptNumber?: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const ref = searchParams.get('ref');
  const gateway = searchParams.get('gateway');

  const [showConfetti, setShowConfetti] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      // If we have an orderId, fetch directly
      if (orderId) {
        try {
          const docSnap = await getDoc(doc(firestore, 'orders', orderId));
          if (docSnap.exists()) {
            setOrder({ id: docSnap.id, ...docSnap.data() } as OrderData);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        }
        setLoading(false);
        return;
      }

      // If we have a Paystack reference, verify and get order
      if (ref && gateway === 'paystack') {
        setVerifying(true);
        try {
          const res = await fetch(`/api/payments/paystack/verify?reference=${ref}`);
          const data = await res.json();

          if (data.success && data.status === 'success') {
            // Poll for the order
            const statusRes = await fetch(`/api/payments/status/${ref}`);
            const statusData = await statusRes.json();

            if (statusData.found && statusData.orderId) {
              const docSnap = await getDoc(doc(firestore, 'orders', statusData.orderId));
              if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() } as OrderData);
              }
            }
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
        }
        setVerifying(false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, ref, gateway]);

  const receiptNumber = order?.mpesaReceiptNumber || order?.paystackReceiptNumber || order?.id?.slice(0, 12).toUpperCase();

  return (
    <>
      <style jsx global>{`
                @keyframes fall {
                    0% { top: -10%; opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
            `}</style>
      <div className="relative overflow-hidden min-h-screen bg-obsidian text-white">
        {showConfetti && Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} id={i} />)}

        <div className="container mx-auto max-w-2xl text-center py-20 md:py-32 px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mx-auto h-32 w-32 rounded-full bg-kenyan-green/20 flex items-center justify-center mb-8"
          >
            <CheckCircle className="h-20 w-20 text-kenyan-green" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter italic"
          >
            You&apos;re <span className="text-gold">In!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-lg text-white/60"
          >
            Your tickets are secured. A confirmation has been sent to your email.
          </motion.p>

          {loading || verifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
              <p className="text-[10px] uppercase tracking-widest text-gold/60 font-black">
                {verifying ? 'Verifying Payment...' : 'Loading Order Details...'}
              </p>
            </motion.div>
          ) : order ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="mt-12 text-left border-white/5">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-gold/60 font-black mb-1">Order Reference</div>
                      <div className="font-black text-xl tracking-tight">#{receiptNumber}</div>
                    </div>
                    <div className="px-4 py-2 bg-kenyan-green/20 rounded-xl">
                      <span className="text-kenyan-green font-black text-sm uppercase">Confirmed</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6 space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm">{item.name}</div>
                          <div className="text-[10px] text-white/40 uppercase">{item.variant?.name || 'Standard'} × {item.quantity}</div>
                        </div>
                        <div className="font-black tracking-tight">KES {(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-white/10 pt-6 flex justify-between items-end">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-black">Total Paid</div>
                    <div className="text-3xl font-black tracking-tight italic text-gold">KES {order.total?.toLocaleString()}</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <Mail className="h-5 w-5 text-gold" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 font-black">Receipt sent to</div>
                      <div className="font-bold">{order.contactEmail}</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              <GlassCard className="p-8 border-white/5 text-center">
                <p className="text-white/60">Order details will appear here shortly.</p>
              </GlassCard>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-obsidian font-black uppercase h-16 px-8 rounded-2xl">
              <Link href="/profile">
                <Ticket className="mr-2 h-5 w-5" /> View My Tickets
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/10 bg-white/5 font-bold uppercase h-16 px-8 rounded-2xl hover:bg-white/10">
              <Link href="/events">
                <ShoppingBag className="mr-2 h-5 w-5" /> Explore More Events
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
