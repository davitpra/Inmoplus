//create is from create a global state with zustand
import {create} from 'zustand'

interface LoginModalStore {
    isOpen: boolean
    onOpen: ()=> void
    onClose: ()=> void
}

// create a global store for Open and Close
export const useLoginModal = create <LoginModalStore> ((set)=>({
    isOpen: false,
    onOpen: () => set({ isOpen:true }),
    onClose: () => set({ isOpen:false })
}))

