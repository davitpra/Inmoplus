'use client'

import axios from "axios"
import { useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Modal } from "./Modal"
import { Heading } from "../Heading"
import { useRegisterModal } from "../hooks/useRegisterModal"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { Input } from "../inputs/Input"
import { toast } from "react-hot-toast"
import { Button } from "../Button"


export const RegisterModal = () => {
    // registramos el estado grobal
    const registerModal = useRegisterModal ()
    const [isLoading, setIsLoading] = useState(false)

    const { 
        // para obtener los datos del input
        register,
        // para gestionar el boton de submit del formulario
        handleSubmit, 
        // obtenemos el error de formState
        formState:{
            errors
        }
        } = useForm<FieldValues> ({
            // le damos unos valores por defecto. 
            defaultValues: {
                name: '',
                email:'',
                password: '',
            }
        })

    // manejamos el evento de Submit del formulario
    const onSubmit: SubmitHandler<FieldValues> = (data)=>{
        setIsLoading(true)
        //enviamos al api la data. 
        axios.post('/api/register', data)
            .then (()=> {
                //cerramos el la ventana de registro
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
                onClick= {()=>{}}
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
