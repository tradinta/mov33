
import { firestore } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export interface AuditLogEntry {
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    action: string;
    status: 'success' | 'failure';
    ipAddress?: string;
    userAgent?: string;
    timestamp: Timestamp;
    metadata?: any;
}

export const logAccess = async (entry: Omit<AuditLogEntry, 'timestamp'>) => {
    try {
        const logsCol = collection(firestore, 'audit_logs');
        await addDoc(logsCol, {
            ...entry,
            timestamp: Timestamp.now()
        });
        console.log(`[AUDIT] ${entry.action} by ${entry.userEmail}`);
    } catch (error) {
        console.error("Failed to write audit log:", error);
        // Do not block app flow if logging fails
    }
};

export const getClientIP = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (e) {
        console.warn("Could not fetch IP", e);
        return 'Unknown';
    }
};
