'use client'

interface MenuItemsProps {
    onclick: ()=> void
    label:string
}

export const MenuItem: React.FC <MenuItemsProps>= ({onclick, label}) => {
  return (
    <div
        onClick={onclick}
        className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
    >{label}</div>
  )
}
