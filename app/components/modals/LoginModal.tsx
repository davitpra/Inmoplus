'use client'

import axios from "axios"
import { signIn} from "next-auth/react"
import { useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Modal } from "./Modal"
import { Heading } from "../Heading"
import { useRegisterModal } from "../../hooks/useRegisterModal"
import { useLoginModal } from "@/app/hooks/useLoginModal"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { Input } from "../inputs/Input"
import { toast } from "react-hot-toast"
import { Button } from "../Button"
import { useRouter } from "next/navigation"


export const LoginModal = () => {
    //  use global state of register and login Modal
    const registerModal = useRegisterModal ()
    const loginModal = useLoginModal ()
    const [isLoading, setIsLoading] = useState(false)

    //manage the navegation
    const router = useRouter()

    const { 
        // to obtain the input data
        register,
        // to handle the submit button form
        handleSubmit, 
        // obtain the error of the Form
        formState:{
            errors
        }
        } = useForm<FieldValues> ({ 
            defaultValues: {
                email:'',
                password: '',
            }
        })

    // codding the submit event of the Form
    const onSubmit: SubmitHandler<FieldValues> = (data)=>{
        setIsLoading(true)
        //codding the singIn option. 
        signIn('credentials', {
            ...data,
            redirect:false
        })
        .then ( (callback) =>{
            setIsLoading(false)
            
            //if all good
            if(callback?.ok) {
                toast.success('Login successfully')
                router.refresh()
                loginModal.onClose()
            }
            //if something go wrong
            if(callback?.error) {
                toast.error(callback.error)
            }

        })

    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
             <Heading 
                title=" Welcome back"
                subtitle="Login to your account"
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
        isOpen = {loginModal.isOpen}
        title="Login"
        actionLabel="Continue"
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
  )
}
