'use client'

import { Container } from '../Container'
import { BsSnow} from 'react-icons/bs'
import { FaSkiing} from 'react-icons/fa'
import { IoDiamond } from 'react-icons/io5'
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb'
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiIsland, GiWindmill } from 'react-icons/gi'
import { MdOutlineVilla } from 'react-icons/md'
import { CategoryBox } from '../CategoryBox'
import { usePathname, useSearchParams } from 'next/navigation'


export const categories =[
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'this property is close to the beach!'
    },
    {
        label: 'Windmills',
        icon: GiWindmill,
        description: 'this property has windmills!'
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'this property is modern!'
    },
    {
        label: 'Countryside',
        icon: TbMountain,
        description: 'this property is un the countryside!'
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'this property has a pool!'
    },
    {
        label: 'Islands',
        icon: GiIsland,
        description: 'this property is on an island!'
    },
    {
        label: 'Lake',
        icon: GiBoatFishing,
        description: 'this property is close to a lake!'
    },
    {
        label: 'Skiing',
        icon: FaSkiing,
        description: 'this property has skiing activities!'
    },
    {
        label: 'Castles',
        icon: GiCastle,
        description: 'this property is close to a castle!'
    },
    {
        label: 'Camping',
        icon: GiCastle,
        description: 'this property has camping activities!'
    },
    {
        label: 'Arctic',
        icon: BsSnow,
        description: 'this property is arctic activities!'
    },
    {
        label: 'Cave',
        icon: GiCaveEntrance,
        description: 'this property is in a cave!'
    },
    {
        label: 'Desert',
        icon: GiCactus,
        description: 'this property is in a desert!'
    },
    {
        label: 'Barns',
        icon: GiBarn,
        description: 'this property is in the barn!'
    },
    {
        label: 'Lux',
        icon: IoDiamond,
        description: 'this property is luxurious!'
    },
]

export const Categories = () => {
    const params = useSearchParams()
    //gets the query category
    const category = params?.get('category')

    //logic if we are in Main Page.
    const pathname = usePathname()
    const isMainPage = pathname ==="/"

    // if we no are in the main page we return null
    if(!isMainPage){
        return null
    }

  return (
    <Container>
        <div
            className='
                pt-4
                flex
                flex-row
                items-center
                justify-between
                overflow-x-auto
            '
        >
        {categories.map((item) =>(
            <CategoryBox 
                key = {item.label}
                label = {item.label}
                selected = {category === item.label}
                icon = {item.icon}
            />
        ))}
        </div>
    </Container>
  )
}
