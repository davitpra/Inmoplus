'use client'

import axios from 'axios'
import { toast } from 'react-hot-toast';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

import { useRentModal } from "@/app/hooks/useRentModal"

import { Modal } from "./Modal"
import { Heading } from "../Heading"
import { categories } from "../navbar/Categories"

import { CategoryInput } from "../inputs/CategoryInput"
import { Input } from '../inputs/Input'
import { CountrySelect } from "../inputs/CountrySelect"
import { Counter } from '../inputs/Counter'
import { ImageUpload } from '../inputs/ImageUpload'

import dynamic from "next/dynamic"

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

    const router = useRouter()
    // use de store of RentModal
    const rentModal = useRentModal()

    const [isLoading, setIsLoading] = useState(false);
    //to know in which step of the process are
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
    const imageSrc  = watch('imageSrc');

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

    // Bottons to go next and back on Modal
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

    //On submit function to post the data on DB
    const onSubmit: SubmitHandler <FieldValues> = (data) => {
        //check if it is in the last sept. 
        if (step !== STEPS.PRICE) {
          return onNext();
        }
        
        setIsLoading(true);
        
        //posting form on api listings
        axios.post('/api/listings', data)
        .then(() => {
          toast.success('Listing created!');
          router.refresh();
          reset();
          setStep(STEPS.CATEGORY)
          rentModal.onClose();
        })
        .catch(() => {
          toast.error('Something went wrong.');
        })
        .finally(() => {
          setIsLoading(false);
        })
      }

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
                    onChange={(value) => setCustomValue("location", value)}
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
                    value={imageSrc}
                    onChange={(value) => setCustomValue("imageSrc", value)}
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

    // body Content for STEP 6: PRICE 
    if (step === STEPS.PRICE) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Now, set your price"
              subtitle="How much do you charge per night?"
            />
            <Input
              id="price"
              label="Price"
              formatPrice 
              type="number" 
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
        onSubmit={handleSubmit(onSubmit)}
        actionLabel= {actionLabel}
        sencondaryActionLabel={secondaryActionLabel}
        sencondaryAction={step ===STEPS.CATEGORY ? undefined : onBack}
        title = 'Airbnb your home!' 
        body={bodyContent}
    />
  )
}
