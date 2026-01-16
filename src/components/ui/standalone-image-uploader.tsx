'use client';

import React, { useState } from 'react';
import { getSignature } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface StandaloneImageUploaderProps {
    onUpload: (url: string) => void;
    onRemove?: () => void;
    currentImageUrl?: string;
    folder?: string;
    label?: string;
    className?: string;
}

export function StandaloneImageUploader({
    onUpload,
    onRemove,
    currentImageUrl,
    folder = 'profiles',
    label = 'Upload Image',
    className = ''
}: StandaloneImageUploaderProps) {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Image must be less than 5MB."
            });
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const { timestamp, signature } = await getSignature(folder);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp.toString());
            formData.append('folder', folder);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');

            const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setProgress(percentCompleted);
                }
            };

            xhr.onload = () => {
                setUploading(false);
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    onUpload(response.secure_url);
                    toast({
                        title: "Upload Successful",
                        description: "Your image has been updated."
                    });
                } else {
                    console.error('Upload failed:', xhr.responseText);
                    toast({
                        variant: "destructive",
                        title: "Upload Failed",
                        description: "There was an error uploading your image. Please try again."
                    });
                }
            };

            xhr.onerror = () => {
                setUploading(false);
                toast({
                    variant: "destructive",
                    title: "Network Error",
                    description: "Please check your internet connection."
                });
            };

            xhr.send(formData);
        } catch (error) {
            console.error('Error getting signature:', error);
            setUploading(false);
            toast({
                variant: "destructive",
                title: "Configuration Error",
                description: "Could not connect to the upload service."
            });
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {currentImageUrl ? (
                <div className="relative group aspect-square w-32 rounded-2xl overflow-hidden border-2 border-gold/20 bg-white/5">
                    <Image
                        src={currentImageUrl}
                        alt="Preview"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={onRemove}
                            className="p-2 bg-destructive/80 text-white rounded-full hover:bg-destructive transition-colors"
                            title="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative aspect-square w-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:border-gold/40 hover:bg-gold/5 transition-all flex flex-col items-center justify-center text-center p-4 cursor-pointer">
                    {uploading ? (
                        <div className="space-y-2">
                            <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
                            <p className="text-[10px] font-bold text-gold uppercase">{progress}%</p>
                        </div>
                    ) : (
                        <>
                            <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">{label}</span>
                        </>
                    )}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            )}
            {uploading && progress < 100 && (
                <div className="w-32">
                    <Progress value={progress} className="h-1 bg-white/5" />
                </div>
            )}
        </div>
    );
}
