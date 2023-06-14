'use client'

interface HeadingProps {
    title: string
    subtitle?: string,
    center?: boolean
}

export const Heading: React.FC <HeadingProps>= ({
    title,
    subtitle,
    center
}) => {
  return (
    <div
        className={ center? 'text-center' : 'text-start'}
    >
        <h2 className="text-2xl font-bold">
            {title}
        </h2>
        <p className="font-light text-neutral-500 mt-2">
            {subtitle}
        </p>
    </div>
  )
}
