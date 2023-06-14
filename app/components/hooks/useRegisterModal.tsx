//create is from create a global state with zustand
import {create} from 'zustand'

interface RegisterModalStore {
    isOpen: boolean
    onOpen: ()=> void
    onClose: ()=> void
}

// create a global store for Open and Close
export const useRegisterModal = create <RegisterModalStore> ((set)=>({
    isOpen: false,
    onOpen: () => set({ isOpen:true }),
    onClose: () => set({ isOpen:false })
}))

