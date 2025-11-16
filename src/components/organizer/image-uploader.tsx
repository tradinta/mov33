
'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getSignature } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  name: string;
  folder: string;
}

export function ImageUploader({ name, folder }: ImageUploaderProps) {
  const { setValue, watch } = useFormContext();
  const { toast } = useToast();
  const imageUrl = watch(name);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const { timestamp, signature } = await getSignature(folder);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setProgress(percentCompleted);
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setValue(name, response.secure_url, { shouldValidate: true, shouldDirty: true });
        } else {
          console.error('Upload failed:', xhr.responseText);
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "There was an error uploading your image. Please try again."
          })
        }
      }
    };

    xhr.send(formData);
  };
  
  const removeImage = () => {
      setValue(name, '', { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative group w-full h-48 rounded-md overflow-hidden border">
          <Image src={imageUrl} alt="Uploaded image" layout="fill" objectFit="cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-48 rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center p-4 text-center relative">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
                Drag & drop or click to upload
            </p>
            <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
      )}
      {uploading && (
        <div className="mt-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% uploaded</p>
        </div>
      )}
    </div>
  );
}
