import { Search } from "lucide-react";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { DatePicker, Space } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { useTranslation } from 'react-i18next';

const AnalyticsFilter = ({ categories, searchTerm, onSearchChange, status, setStatus, category, setCategory, setDate, sortOption, setSortOption }) => {
    const { t } = useTranslation();

    return (
        <div className="px-8 pb-6">
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                <CardContent className="p-5">
                    <div className="grid grid-cols-8 gap-4 items-end">

                        {/* Search Input */}
                        <div className="relative flex-4 col-span-4">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder={t('adc_search_event_name')}
                                value={searchTerm}
                                onChange={onSearchChange}
                                className="pl-9 pr-4 py-2 w-full border-gray-300"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="col-span-1">
                            <Select
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="all">{t('adc_all_category')}</SelectItem>
                                    {categories?.map(c => (
                                        <SelectItem
                                            key={c.categoryId}
                                            value={c.categoryId}
                                        >
                                            {c.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="col-span-1">
                            <Select
                                value={status}
                                onValueChange={setStatus}
                            >
                                <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="all">{t('adc_all_status')}</SelectItem>
                                    <SelectItem value="PENDING">{t('adc_pending_status')}</SelectItem>
                                    <SelectItem value="APPROVED">{t('adc_approved')}</SelectItem>
                                    <SelectItem value="COMPLETED">{t('adc_completed_status')}</SelectItem>
                                    <SelectItem value="REJECTED">{t('adc_rejected')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Picker */}
                        <div className="col-span-1">
                            <Space vertical className=''>
                                <DatePicker
                                    size="large"
                                    style={{ height: 36, backgroundColor: '#f7f7f7' }}
                                    onChange={setDate}
                                    placeholder={t('adc_select_date')}
                                />
                            </Space>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="col-span-1">
                            <Select
                                value={sortOption}
                                onValueChange={setSortOption}
                            >
                                <SelectTrigger
                                    className="w-[140px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="newest">{t('adc_newest')}</SelectItem>
                                    <SelectItem value="oldest">{t('adc_oldest')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default AnalyticsFilter;