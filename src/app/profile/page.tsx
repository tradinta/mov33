import { MyTickets } from "@/components/profile/my-tickets";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | Mov33',
  description: 'Manage your tickets, view your history, and check your Mov Points.',
};


export default function ProfilePage() {
    return (
        <MyTickets />
    );
}
