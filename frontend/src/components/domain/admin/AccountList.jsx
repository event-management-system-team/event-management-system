import { useEffect, useMemo, useState } from "react";
import { AccountsPagination } from "../admin/AccountsPagination";
import { Avatar, AvatarFallback, AvatarImage } from "../admin/Avatar";
import { Badge } from "../admin/Badge";
import { Card, CardContent } from "../admin/Card";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { CheckCircle, Eye, MoreVertical, UserCircle, UserX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./Dropdown-Menu";
import { Popconfirm } from "antd";
import { adminService } from "../../../services/admin.service";
import dayjs from "dayjs";

const AccountList = ({ searchTerm, status, role, date, sortOption, onLoading, onError, showAlert, onBan, refreshKey }) => {
    const [accounts, setAccounts] = useState([])
    const [originalAccounts, setOriginalAccounts] = useState([])
    const [currentPage, setCurrentPage] = useState(0);

    const fetchData = async () => {
        try {
            onLoading(true)

            const [accountRes, allAccountRes] = await Promise.all([
                adminService.getAllAccounts(currentPage, 10),
                adminService.getAllAccountsPlain()
            ])

            setAccounts(accountRes.data.content)
            setCurrentPage(accountRes.data.number)

            setOriginalAccounts(allAccountRes.data);

        } catch (error) {
            onError("Cannot load accounts")
            console.error(error)
        } finally {
            onLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchData()
    }, [refreshKey])

    useEffect(() => {
        fetchData()
    }, [currentPage])

    const handleToggleBan = async (account) => {
        if (!account) return;

        const isBanned = account.status === "BANNED";
        const action = isBanned ? "ACTIVATE" : "BAN";

        try {
            await adminService.toggleBan(account.userId);
            showAlert("success", `${action} account successfully`, 2500);
            onBan()
            setTimeout(() => {
                fetchData()
            }, 300);
        } catch (error) {
            console.error(error)
            showAlert("error", "Operation failed", 4000)
        }
    }

    const processedAccounts = useMemo(() => {
        let list = [...originalAccounts];

        if (searchTerm?.trim()) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(acc =>
                acc.fullName?.toLowerCase().includes(lower) ||
                acc.email?.toLowerCase().includes(lower) ||
                acc.phone?.includes(searchTerm)
            );
        }

        // filter by status
        list = list.filter(account => status === "all" || account.status === status);

        // filter by user role
        list = list.filter(account => role === "all" || account.role === role);

        // filter by date
        list = list.filter(account => {
            if (!date) return true;

            return dayjs(account.createdAt).isSame(date, "day");
        });

        // sort by option
        list.sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "name":
                    return (a.fullName ?? "").localeCompare(b.fullName ?? "");
                default:
                    return 0;
            }
        });

        return list;
    }, [originalAccounts, searchTerm, status, role, date, sortOption]);

    const pageSize = 10;
    const startItem = currentPage * pageSize + 1;
    const isSearching = searchTerm?.trim().length > 0;

    const totalItems = processedAccounts.length;
    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / pageSize)
    );

    useEffect(() => {
        if (currentPage > totalPages - 1) {
            setCurrentPage(0);
        }
    }, [totalPages]);

    const paginatedAccounts = processedAccounts.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const handlePrev = () => {
        if (isSearching || currentPage === 0) return;
        setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (isSearching || currentPage >= totalPages - 1) return;
        setCurrentPage(prev => prev + 1);
    };

    const handlePageChange = (p) => {
        if (isSearching) return;
        setCurrentPage(p - 1);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatRole = (role) => {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "ACTIVE":
                return "default";
            case "BANNED":
                return "destructive";
            default:
                return "secondary";
        }
    }

    const getStatusClasses = (status) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700 hover:bg-green-100";
            case "BANNED":
                return "bg-red-100 text-red-700 hover:bg-red-100";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="px-8 pb-8">
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                <CardContent className="p-0">
                    {/* Table Header */}
                    <div
                        className="grid grid-cols-11 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                        <div className="col-span-4 ml-5">Account</div>
                        <div className="col-span-2">Phone Number</div>
                        <div className="col-span-1">Role</div>
                        <div className="col-span-2">Joined Date</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Account Rows */}
                    {!paginatedAccounts || paginatedAccounts.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-gray-400 mt-15">
                            No account data yet
                        </div>
                    ) : (
                        paginatedAccounts.map(account => (
                            <div
                                key={account.userId}
                                className="grid grid-cols-11 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
                            >
                                <div className="col-span-4 flex items-center gap-3 ml-5">
                                    <Avatar className="w-10 h-10 mr-4">
                                        {account.avatarUrl ? (
                                            <AvatarImage src={account.avatarUrl} alt={account.fullName} />
                                        ) : (
                                            <AvatarFallback className="bg-gray-300" />
                                        )}
                                    </Avatar>

                                    <div>
                                        <div className="font-medium text-sm text-gray-900">
                                            {account.fullName}
                                        </div>
                                        <div className="text-xs text-gray-500">{account.email}</div>
                                    </div>
                                </div>
                                <div className="col-span-2 text-sm text-gray-600">
                                    {account.phone}
                                </div>
                                <div className="col-span-1 text-sm text-gray-900 font-medium">
                                    {formatRole(account.role)}
                                </div>
                                <div className="col-span-2 text-sm text-gray-600">
                                    {formatDate(account.createdAt)}
                                </div>
                                <div className="col-span-1">
                                    <Badge
                                        variant={getStatusVariant(account.status)}
                                        className={getStatusClasses(account.status)}
                                    >
                                        ● {account.status}
                                    </Badge>
                                </div>
                                <div className="col-span-1 flex justify-end gap-1">
                                    <Link to={`/admin/accounts/account-detail/${account.userId}`}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-gray-100 cursor-pointer"
                                            title="View account details"
                                        >
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </Link>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-gray-100 cursor-pointer">
                                                <MoreVertical className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"
                                            className="bg-[#f7f7f7] border-2 border-gray-200">
                                            <Link to={`/admin/accounts/account-detail/${account.userId}`}>
                                                <DropdownMenuItem>
                                                    <UserCircle className="mr-2 h-4 w-4" />
                                                    View account details
                                                </DropdownMenuItem>
                                            </Link>

                                            {account.role !== "ADMIN" && (
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                    {account.status === "BANNED" ? (
                                                        <Popconfirm
                                                            title="Activate account"
                                                            description="Are you sure to activate this account?"
                                                            onConfirm={() => handleToggleBan(account)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <div
                                                                className="flex items-center gap-2 w-full"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Activate account
                                                            </div>
                                                        </Popconfirm>
                                                    ) : (
                                                        <Popconfirm
                                                            title="Ban account"
                                                            description="Are you sure to ban this account?"
                                                            onConfirm={() => handleToggleBan(account)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <div
                                                                className="flex items-center gap-2 w-full"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Ban account
                                                            </div>
                                                        </Popconfirm>
                                                    )}
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Footer with Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            {isSearching ? (
                                <>Showing {processedAccounts.length} search results</>
                            ) : (
                                <>Showing {totalItems === 0 ? 0 : startItem}–{Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} accounts</>
                            )}
                        </div>

                        <AccountsPagination
                            handleNext={handleNext}
                            handlePrev={handlePrev}
                            handlePageChange={handlePageChange}
                            page={currentPage + 1}
                            totalPages={totalPages}
                            isSearching={isSearching}
                        />
                    </div>

                </CardContent>
            </Card>
        </div>
    )
};

export default AccountList;