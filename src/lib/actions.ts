
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import type { EventFormValues } from '@/app/organizer/events/new/page';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


export async function getSignature(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: folder,
        },
        process.env.CLOUDINARY_API_SECRET as string
    );

    return { timestamp, signature };
}
