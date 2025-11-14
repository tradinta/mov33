'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { getSignature } from '@/lib/actions';

interface ImageUploaderProps {
  name: string;
  label: string;
  description: string;
  folder: string;
}

export function ImageUploader({ name, label, description, folder }: ImageUploaderProps) {
  const { control, setValue, getValues } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageUrl = getValues(name);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const { timestamp, signature } = await getSignature(folder);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('folder', folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`;
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
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
            // You might want to show a toast message here
          }
        }
      };

      xhr.send(formData);

    } catch (error) {
      console.error('Failed to get signature or upload:', error);
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };
  
  const clearImage = () => {
    setValue(name, '', { shouldValidate: true, shouldDirty: true });
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {field.value ? (
                <div className="relative group w-full aspect-video rounded-lg overflow-hidden border">
                  <Image src={field.value} alt="Uploaded image" layout="fill" objectFit="cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor={name}
                  className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50"
                >
                  {uploading ? (
                    <div className="w-full px-8 space-y-2">
                        <Progress value={progress} />
                        <p className="text-sm text-center text-muted-foreground">{progress}% uploaded</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <Input id={name} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </>
                  )}
                </label>
              )}
            </div>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
