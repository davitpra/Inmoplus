'use client'
import type React from 'react'
import { useMemo, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { Modal } from "./Modal"
import { Heading } from "../Heading"
import { useRentModal } from "@/app/hooks/useRentModal"
import { categories } from "../navbar/Categories"
import { CategoryInput } from "../inputs/CategoryInput"
import { CountrySelect } from "../inputs/CountrySelect"
import dynamic from "next/dynamic"
import { Counter } from '../inputs/Counter'
import { ImageUpload } from '../inputs/ImageUpload'
import { Input } from '../inputs/Input'

// diferents steps of the proces.
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION =4,
    PRICE = 5
}

export const RentModal = () => {
    // use de store of RentModal
    const rentModal = useRentModal()

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(STEPS.CATEGORY)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        },
        reset
    } = useForm <FieldValues>({
        defaultValues:{
            category:'',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc:'',
            price: 1,
            title: '',
            description: ''
        }
    })

    // a tracking of the value from ReactForm
    const location = watch('location')
    const category = watch('category')
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc  = watch('imageSrc ');

    // especial import for Map Component for solution a render problem
    const Map = useMemo (() => {
        // created to disable the warning. 
        let domiVariable = location
        // dinamic import of map without tipe error
        return dynamic( () => import ('../Map').then((module) => module.Map), {
        // to dont use Server Side Render
        ssr:false
        })
    }, [location])

    // a modification of setValue to dont re-render de pag
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        })
      }
    // logic to navegate into the process
    const onBack = ()=>{
        setStep((value) => value - 1)
    }

    const onNext =() => {
        setStep((value)=> value + 1)
    }

    // labes of the accion boton
    const actionLabel = useMemo(()=>{
        if(step=== STEPS.PRICE){
            return 'Create'
        }
        return 'Next'
    },[step])

    const secondaryActionLabel = useMemo(()=>{
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return 'Back'
    },[step])

    // body Content for STEP 1: categories
    let bodyContent = (
        <div className="felx flex-col gap-8">
            <Heading 
                title="Which of these best describe your place?"
                subtitle="Pick a category"
            />
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                    max-h-[50vh]
                    overflow-y-auto
                "
            >
                {categories.map((item)=>(
                    <div key={item.label} className="col-span-1">
                        <CategoryInput 
                            onClick = {(category)=>{
                                setCustomValue('category', category)
                            }}
                            selected={category===item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>

        </div>
    )

    // body Content for STEP 2: location
    if (step === STEPS.LOCATION) {
        //NOTA PERSONAL! Davidcito, location es null, por eso no funciona el map
        bodyContent = (
            <div
                className=" flex flex-col gap-8"
            >
                <Heading 
                    title=" Where is your place located?"
                    subtitle="Help guest find you!"
                />
                <CountrySelect 
                    value={location}
                    onChange={(value) => setCustomValue("localtion", value)}
                />
                <Map center= {location?.latlng} />
            </div>
        )
    }

    // body Content for STEP 3: INFO
    if (step === STEPS.INFO) {
        bodyContent = (
            <div
                className=" flex flex-col gap-8"
            >
                <Heading 
                    title=" Share some basics about your place?"
                    subtitle="What amenities do you have?"
                />
                <Counter 
                    onChange={(value) => setCustomValue('guestCount', value)}
                    value={guestCount}
                    title="Guests" 
                    subtitle="How many guests do you allow?"
                />
                <hr />
                <Counter 
                    onChange={(value) => setCustomValue('roomCount', value)}
                    value={roomCount}
                    title="Rooms" 
                    subtitle="How many rooms do you have?"
                />
                <hr />
                <Counter 
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                    value={bathroomCount}
                    title="Bathrooms" 
                    subtitle="How many bathrooms do you have?"
                />
            </div>
        )
    }

    // body Content for STEP 4: IMAGES
    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div
                className=" flex flex-col gap-8"
            >
                <Heading 
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                />
                <ImageUpload
                    onChange={(value) => setCustomValue('imageSrc', value)}
                    value={imageSrc}
                />
            </div>
        )
    }

    // body Content for STEP 5: DESCRIPTION 
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div
                className=" flex flex-col gap-8"
            >
                <Heading 
                    title="How would you describe your place?"
                    subtitle="Short and sweet works best!"
                />
                <Input 
                     id="title"
                     label="Title"
                     disabled={isLoading}
                     register={register}
                     errors={errors}
                     required 
                />
                <hr />
                <Input
                  id="description"
                  label="Description"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
            </div>
        )
    }

  return (
    <Modal
        isOpen = {rentModal.isOpen}
        onClose = {rentModal.onClose}
        onSubmit={onNext}
        actionLabel= {actionLabel}
        sencondaryActionLabel={secondaryActionLabel}
        sencondaryAction={step ===STEPS.CATEGORY ? undefined : onBack}
        title = 'Airbnb your home!' 
        body={bodyContent}
    />
  )
}
