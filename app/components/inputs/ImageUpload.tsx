'use client'

import Image from "next/image"
import type { MouseEventHandler } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { useCallback } from "react"
import { TbPhotoPlus } from 'react-icons/tb'

//global variable for cloudinary
declare global {
    var cloudinary: any
  }

// Configuration on cloudinary to save on it. 
const uploadPreset = "d5njlfco";

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
  }

export const ImageUpload:React.FC <ImageUploadProps>= ({
    onChange,
    value
}) => {
    // function for success upload to cloudinary
    const handleUpload = useCallback((result :any) =>{
        //safe the value on the Form
        onChange(result.info.secure_url)
    },[onChange] )

    console.log(value)
  return (
    <CldUploadWidget
        onUpload={handleUpload} 
        uploadPreset={uploadPreset}
        options={{
        maxFiles: 1
        }}
    >
    {({ open }) => {
      const handleOnClick: MouseEventHandler<HTMLDivElement>= (e)=> {
        e.preventDefault()
        open?.()
      }
        return (
          <div
            onClick={handleOnClick}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {/* when you upload a image */}
            {value && (
              <div className="absolute inset-0 w-full h-full z-3">
                <Image
                  alt="Upload" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={value} 
                />
              </div>
            )}
          </div>
        ) 
    }}
    </CldUploadWidget>
  )
}
