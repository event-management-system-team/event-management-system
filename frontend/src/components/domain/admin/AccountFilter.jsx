import { Search } from "lucide-react";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { DatePicker, Space } from "antd";
import { useTranslation } from 'react-i18next';

const AccountFilter = ({ searchTerm, onSearchChange, status, setStatus, role, setRole, setDate, sortOption, setSortOption }) => {
    const { t } = useTranslation();

    return (
        <div className="px-8 pb-4">
            <div className="flex items-center gap-3">

                {/* Search Input */}
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={t('adc_search_account_placeholder')}
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="pl-9 pr-4 py-2 w-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5] bg-[#f7f7f7]"
                    />
                </div>

                {/* Status Filter */}
                <Select
                    value={status}
                    onValueChange={setStatus}
                >
                    <SelectTrigger
                        className="w-[160px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='border border-gray-200'>
                        <SelectItem value="all">{t('adc_all_status')}</SelectItem>
                        <SelectItem value="ACTIVE">{t('adc_active_filter')}</SelectItem>
                        <SelectItem value="BANNED">{t('adc_banned_filter')}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Role Filter */}
                <Select
                    value={role}
                    onValueChange={setRole}
                >
                    <SelectTrigger
                        className="w-[160px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='border border-gray-200'>
                        <SelectItem value="all">{t('adc_all_accounts')}</SelectItem>
                        <SelectItem value="ORGANIZER">{t('adc_organizer_account')}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date Filter */}
                <Space vertical className=''>
                    <DatePicker
                        size="large"
                        style={{ height: 36, backgroundColor: '#f7f7f7' }}
                        onChange={setDate}
                        placeholder={t('adc_select_date')}
                    />
                </Space>

                {/* Sort Dropdown */}
                <Select
                    value={sortOption}
                    onValueChange={(value) => setSortOption(value)}
                >
                    <SelectTrigger
                        className="w-[140px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='border border-gray-200'>
                        <SelectItem value="newest">{t('adc_newest')}</SelectItem>
                        <SelectItem value="oldest">{t('adc_oldest')}</SelectItem>
                        <SelectItem value="name">{t('adc_name_az')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
};

export default AccountFilter;