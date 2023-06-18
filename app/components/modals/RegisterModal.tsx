'use client'

import axios from "axios"
import { useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Modal } from "./Modal"
import { Heading } from "../Heading"
import { useRegisterModal } from "../../hooks/useRegisterModal"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { Input } from "../inputs/Input"
import { toast } from "react-hot-toast"
import { Button } from "../Button"
import {signIn } from "next-auth/react"


export const RegisterModal = () => {
    // use global state of registerModel
    const registerModal = useRegisterModal ()
    const [isLoading, setIsLoading] = useState(false)

    const { 
        // to get the input data
        register,
        // to handdle the submit botton acction of the form
        handleSubmit, 
        // get the error from formState
        formState:{
            errors
        }
        } = useForm<FieldValues> ({
            // give it this default values 
            defaultValues: {
                name: '',
                email:'',
                password: '',
            }
        })

    // manage the submit event of the form
    const onSubmit: SubmitHandler<FieldValues> = (data)=>{
        setIsLoading(true)
        //post the data on the data base 
        axios.post('/api/register', data)
            .then (()=> {
                //close the register modal
                registerModal.onClose()
            })
            .catch ((error)=>{
                toast.error('Something went wrong')
            })
            .finally (()=>{
                setIsLoading(false)
            })
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
             <Heading 
                title=" Welcome to Airbnb"
                subtitle="Create an Acount"
             />
             <Input 
                id = 'email'
                label="Email"
                register={register}
                errors= {errors}
                disabled = {isLoading}
                required
             />
             <Input 
                id = 'name'
                label="Name"
                register={register}
                errors= {errors}
                disabled = {isLoading}
                required
             />
             <Input 
                id = 'password'
                label="Password"
                register={register}
                errors= {errors}
                type="password"
                disabled = {isLoading}
                required
             />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            <Button 
                outline
                label = "Continue with Google"
                icon={FcGoogle}
                onClick= {()=>{}}
            />
            <Button 
                outline
                label = "Continue with GitHub"
                icon={AiFillGithub}
                onClick= {()=>{ signIn ('github') }}
            />
            <div
                className="justify-center flex flex-row items-center gap-2"
            >
                <div>
                    Already have an account?
                </div>
                <div
                    onClick={registerModal.onClose}
                    className="
                        text-neutral-800
                        cursor-pointer
                        hover:underline
                    "
                >
                    Log in
                </div>
            </div>
        </div>
    )

  return (
    <Modal
        disabled={isLoading}
        isOpen = {registerModal.isOpen}
        title="Register"
        actionLabel="Continue"
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
  )
}
