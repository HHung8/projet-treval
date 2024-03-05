"use client";

import React from 'react';
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import Container from '../Container';
import CategoryBox from '../CategoryBox';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaSkiing } from 'react-icons/fa';
import { IoDiamond } from 'react-icons/io5';

export const categories = [
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'This property is close to the beach!'
    },
    {
        label: 'Windmils',
        icon: GiWindmill,
        description: 'This property has windmills!'
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'This property is modern'
    },
    {
        label: 'Countryside',
        icon: TbMountain,
        description: 'This property is in the countryside!'
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'This property has a pool'
    },
    {
        label: 'IsLand',
        icon: GiIsland,
        description: 'This property is on an isLand'
    }, 
    {
        label: 'Lake',
        icon: GiBoatFishing,
        description:  'This property is close to a lake!'
    },
    {
        label: 'Skiing',
        icon: FaSkiing,
        description: 'This property has skkiing actives!'
    },
    {
        label: 'Castles',
        icon: GiCastle,
        description: 'This is in a castle!'
    },
    {
        label: 'Camping',
        icon: GiForestCamp,
        description: 'This property has camping actives!'
    },
    {
        label: 'Cave',
        icon: GiCaveEntrance,
        description: 'This property is in a cave!'
    },
    {
        label: 'Desert',
        icon: GiCactus,
        descriptions: 'This property is in the desert'
    },
    {
        label: 'Barns',
        icon: GiBarn,
        descriptions: 'This property is in the barn'
    }, 
    {
        label: 'Lux',
        icon: IoDiamond,
        description: 'This property is luxurious!',
    }
]

const Categories = () => {
  const params = useSearchParams(); 
// Sử dụng toán tử optional chaining (?.) để kiểm tra xem biến params có tồn tại hay không. Nếu params tồn tại (khác null hoặc undefined), thì phương thức get('category') sẽ được gọi.
// Nếu tham số truy vấn 'category' tồn tại trong URL, giá trị của category sẽ là giá trị của tham số truy vấn 'category'.
// Nếu tham số truy vấn 'category' không tồn tại, hoặc params không tồn tại, giá trị của category sẽ là null.
  const category = params?.get('category');
  const pathname = usePathname(); // Sử dụng usePathname để lấy giá trị của đường dẫn hiện tại trong URL
  const isMainPage = pathname === '/' //Kiểm tra xem trang hiện tại có phải là trang chính hay không 
  // Nếu trang không phải trang chính thì trả về null, Điều này có thể được hiểu là Compopnents categories chỉ được hiển thị khi trang chính đang được xem
  if(!isMainPage) {
    return null;
  }

  return (
    <Container>
        <div className='pt-4 flex flex-row items-center justify-between overflow-x-auto'>
            {categories.map((item) => (
                <CategoryBox 
                    key={item.label}
                    label={item.label}
                    selected={category === item.label}
                    icon={item.icon}
                />
            ))}
        </div>
    </Container>
  )
}

export default Categories