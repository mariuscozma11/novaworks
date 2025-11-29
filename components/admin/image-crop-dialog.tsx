// 'use client';

// import { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';
// import { Area } from 'react-easy-crop/types';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Slider } from '@/components/ui/slider';

// interface ImageCropDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   imageSrc: string;
//   onCropComplete: (croppedImage: Blob) => void;
// }

// async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   if (!ctx) {
//     throw new Error('No 2d context');
//   }

//   // Set canvas size to the cropped area
//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   // Draw the cropped image
//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   // Convert canvas to blob
//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (blob) {
//         resolve(blob);
//       } else {
//         reject(new Error('Canvas is empty'));
//       }
//     }, 'image/jpeg', 0.95);
//   });
// }

// function createImage(url: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener('load', () => resolve(image));
//     image.addEventListener('error', (error) => reject(error));
//     image.src = url;
//   });
// }

// export function ImageCropDialog({
//   open,
//   onOpenChange,
//   imageSrc,
//   onCropComplete,
// }: ImageCropDialogProps) {
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
//   const [processing, setProcessing] = useState(false);

//   const onCropCompleteCallback = useCallback(
//     (croppedArea: Area, croppedAreaPixels: Area) => {
//       setCroppedAreaPixels(croppedAreaPixels);
//     },
//     []
//   );

//   const handleSave = async () => {
//     if (!croppedAreaPixels) return;

//     setProcessing(true);
//     try {
//       const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
//       onCropComplete(croppedImage);
//       onOpenChange(false);
//     } catch (error) {
//       console.error('Failed to crop image:', error);
//       alert('Failed to crop image. Please try again.');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Crop Image</DialogTitle>
//           <DialogDescription>
//             Adjust the crop area to ensure your product image looks great on cards and product pages.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Crop Area */}
//           <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
//             <Cropper
//               image={imageSrc}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropCompleteCallback}
//             />
//           </div>

//           {/* Zoom Slider */}
//           <div className="space-y-2">
//             <Label>Zoom</Label>
//             <Slider
//               value={[zoom]}
//               min={1}
//               max={3}
//               step={0.1}
//               onValueChange={(value) => setZoom(value[0])}
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave} disabled={processing}>
//             {processing ? 'Processing...' : 'Crop & Save'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
