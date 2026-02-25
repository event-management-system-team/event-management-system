import { Wallet } from 'lucide-react'
import React from 'react'
import { Slider, Switch } from 'antd';


const FilterPrice = ({ price, setPrice, isFree, setIsFree }) => {
    const MAX_PRICE = 5000000

    const currentPrice = (price !== '' && price !== undefined && price !== null) ? Number(price) : MAX_PRICE;

    const handleSliderChange = (value) => {
        if (value === MAX_PRICE) {
            setPrice('');
        } else {
            setPrice(String(value));
        }
    };

    const handleSwitchChange = (checked) => {
        setIsFree(checked);
        if (checked) {
            setPrice('');
        }
    }

    return (

        <div className="mb-8">

            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Wallet className="text-primary w-5 h-5" strokeWidth={2.5} />
                    <span className="font-bold text-sm">Price Range</span>
                </div>

                <div className="flex items-center gap-2 px-3">
                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        Free
                    </span>

                    <Switch
                        size="small"
                        checked={isFree}
                        onChange={handleSwitchChange}
                    />
                </div>
            </div>


            <div className="px-2 mt-4">
                <Slider
                    min={0}
                    max={MAX_PRICE}
                    step={50000}
                    value={currentPrice}
                    onChange={handleSliderChange}
                    disabled={isFree}
                    tooltip={{ formatter: (value) => `${value.toLocaleString('vi-VN')}đ` }}
                    className="hover:cursor-pointer"
                />

                <div className="flex justify-between mt-1">
                    <span className="text-[11px] font-bold text-gray-400">0đ </span>
                    <span className="text-[11px] font-bold text-gray-400">5.000.000đ+</span>

                </div>


            </div>
        </div>
    )
}

export default FilterPrice
