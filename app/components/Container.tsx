// its important to marck this
'use client'

// types props for React Components
interface ContainerProps {
    children: React.ReactNode;
}

// especify el types with the interface
export const Container:React.FC<ContainerProps> = ({
    children
}) => {
  return (
    <div
        className="
        max-w-[2520px]
        mx-auto
        xl: px-20 
        md: px-10
        sm: px-2
        px-4
        "
    >
        {children}
    </div>
  )
}
