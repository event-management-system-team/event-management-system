import { Search } from "lucide-react";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { DatePicker, Space } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

const EventFilter = ({ categories, searchTerm, onSearchChange, status, setStatus, category, setCategory, priceType, setPriceType, setDate, sortOption, setSortOption }) => {

    return (
        <div className="px-8 pb-6">
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold">Filter Events</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-7 gap-4 items-end">

                        {/* Search Input */}
                        <div className="col-span-2">
                            <label className="text-sm text-gray-600 mb-2 block">
                                Search
                            </label>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Event name, location, organization..."
                                    value={searchTerm}
                                    onChange={onSearchChange}
                                    className="pl-9 pr-4 py-2 w-full border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="col-span-1">
                            <label className="text-sm text-gray-600 mb-2 block">
                                Status
                            </label>
                            <Select
                                value={status}
                                onValueChange={setStatus}
                            >
                                <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Dropdown */}
                        <div className="col-span-1">
                            <label className="text-sm text-gray-600 mb-2 block">
                                Category
                            </label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="all">All Category</SelectItem>
                                    {categories?.map(c => (
                                        <SelectItem
                                            key={c.categoryId}
                                            value={c.categorySlug}
                                        >
                                            {c.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Type Dropdown */}
                        <div className="col-span-1">
                            <label className="text-sm text-gray-600 mb-2 block">
                                Price Type
                            </label>
                            <Select
                                value={priceType}
                                onValueChange={setPriceType}
                            >
                                <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                    <SelectValue placeholder="Price Type" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="all">All Type</SelectItem>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Picker */}
                        <div className="col-span-1">
                            <label className="text-sm text-gray-600 mb-2 block">
                                Created Date
                            </label>
                            <Space vertical className=''>
                                <DatePicker
                                    size="large"
                                    style={{ height: 36, backgroundColor: '#f7f7f7' }}
                                    onChange={setDate}
                                />
                            </Space>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="col-span-1">
                            <label className="text-sm text-gray-600 mb-2 block">
                                Sort by
                            </label>
                            <Select
                                value={sortOption}
                                onValueChange={setSortOption}
                            >
                                <SelectTrigger
                                    className="w-[140px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default EventFilter;