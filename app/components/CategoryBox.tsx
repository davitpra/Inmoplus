'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { IconType } from 'react-icons'
import qs from 'query-string'

interface CategoryBoxProps {
    icon: IconType,
    label: string,
    selected?:boolean
}
export const CategoryBox:React.FC<CategoryBoxProps>= ({
    icon: Icon,
    label,
    selected
}) => {
    const router = useRouter()
    const params = useSearchParams()

    const handleClick = useCallback(()=>{
        let currentQuery = {}
        // look for the params if they exist
        if (params) {
            // we store our params in currentQuery as an Object 
            currentQuery= qs.parse(params.toString())
        }

        // create a new Query with the category on that. 
        const updatedQuery:any = {
            ...currentQuery,
            category:label
        }

        // if params are already selected its deleted as toogle
        if(params?.get('category')=== label) {
            delete updatedQuery.category
        }

        //create the url string with the query. 
        const url= qs.stringifyUrl({
            url: '/',
            query: updatedQuery
            }, {skipNull:true})
        // here we push url with query into the router
        router.push(url)

    },[params, label, router])
  return (
    <div 
        onClick={handleClick}
        className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-3
            border-b-2
            hover:text-neutral-800
            transition
            cursor-pointer
            ${selected ? 'border-b-neutral-800':'border-transparent'}
            ${selected ? 'text-neutral-800':'text-neutral-500'}
        `}
    >
        <Icon size={26}/>
        <div
            className=' font-medium text-sm'
        >
            {label}
        </div>
    </div>
  )
}
