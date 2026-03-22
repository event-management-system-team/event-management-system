import { useEffect, useState } from "react";
import organizerService from "../../../services/organizer.service";
import { AccountsPagination } from "../admin/AccountsPagination";
import { Avatar, AvatarFallback, AvatarImage } from "../admin/Avatar";
import { Badge } from "../admin/Badge";
import { Card, CardContent } from "../admin/Card";
import { TabsContent } from "../admin/Tabs";

const StaffListTab = ({ id, onLoading, onError }) => {

    const [staffs, setStaffs] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchStaffList = async () => {
        if (!id) return

        try {
            onLoading(true)
            const response = await organizerService.getEventStaff(id, currentPage, 10)

            setStaffs(response.data.content)
            setTotalPages(response.data.totalPages)
            setTotalItems(response.data.totalElements)
        } catch (error) {
            onError("Cannot load staff list");
            console.error(error)
        } finally {
            onLoading(false)
        }
    }

    useEffect(() => {
        fetchStaffList()
    }, [id, currentPage])

    const pageSize = 10;
    const startItem = currentPage * pageSize + 1;

    const handlePrev = () => {
        if (currentPage === 0) return;
        setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage >= totalPages - 1) return;
        setCurrentPage(prev => prev + 1);
    };

    const handlePageChange = (p) => {
        setCurrentPage(p - 1);
    };

    useEffect(() => {
        if (currentPage > totalPages - 1) {
            setCurrentPage(0);
        }
    }, [totalPages]);

    return (
        <TabsContent value="staff" className="space-y-4">
            <div className="px-8 pb-8">
                <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                    <CardContent className="p-0">
                        {/* Table Header */}
                        <div
                            className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                            <div className="col-span-5 ml-5">Staff Member</div>
                            <div className="col-span-4 text-center">Phone Number</div>
                            <div className="col-span-3 text-center">Position</div>
                        </div>

                        {/* Account Rows */}
                        {staffs.length === 0 ? (
                            <div className="flex items-center justify-center flex-1 text-sm text-gray-400 mt-15">
                                No staff data yet
                            </div>
                        ) : (
                            staffs.map(staff => (
                                <div
                                    key={staff.staffId}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
                                >
                                    <div className="col-span-5 flex items-center gap-3 ml-5">
                                        <Avatar className="w-10 h-10 mr-4">
                                            {staff.avatarUrl ? (
                                                <AvatarImage src={staff.avatarUrl} alt={staff.fullName} />
                                            ) : (
                                                <AvatarFallback className="bg-gray-300" />
                                            )}
                                        </Avatar>

                                        <div>
                                            <div className="font-medium text-sm text-gray-900">
                                                {staff.fullName}
                                            </div>
                                            <div className="text-xs text-gray-500">{staff.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-sm text-gray-600 text-center">
                                        {staff.phone}
                                    </div>
                                    <div className="col-span-3 text-sm text-gray-900 font-medium text-center">
                                        <Badge className='text-white'>
                                            {staff.role}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Footer with Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                            <div>
                                Showing {totalItems === 0 ? 0 : startItem}–{Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} results
                            </div>

                            <AccountsPagination
                                handleNext={handleNext}
                                handlePrev={handlePrev}
                                handlePageChange={handlePageChange}
                                page={currentPage + 1}
                                totalPages={totalPages}
                            />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    )
};

export default StaffListTab;