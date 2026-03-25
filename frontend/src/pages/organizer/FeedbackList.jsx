import React, { useState, useEffect, useRef, useMemo } from "react";
import { Eye, Search, Plus, Lock, Filter, Calendar } from "lucide-react";
import { useFeedbacks } from "../../hooks/useFeedback";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "antd";
import axiosInstance from "../../config/axios";

const FeedbackList = () => {
  const { eventId } = useParams();
  const { data: feedbacks, isLoading, isError } = useFeedbacks(eventId);

  const [isEventEnded, setIsEventEnded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const listTopRef = useRef(null);

  // --- STATE MỚI: Quản lý các bộ lọc ---
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [eventName, setEventName] = useState("Loading...");
  
  // NPS Emoji array từ 1-10
  const npsEmojis = ['😡', '😠', '😞', '🙁', '😐', '🙂', '😊', '😀', '😁', '😍'];

  useEffect(() => {
    const checkEventStatus = async () => {
      try {
        const response = await axiosInstance.get(`/events/ids/${eventId}`);
        const eventData = response.data?.data || response.data;

        if (eventData) {
          // --- THÊM DÒNG NÀY ---
          // Thay .name bằng .title hoặc .eventName tùy thuộc vào cấu trúc Backend của bạn trả về
          setEventName(eventData.name || eventData.title || eventData.eventName || "Unknown Event");

          if (eventData.endDate) {
            const isEnded =
              new Date().getTime() > new Date(eventData.endDate).getTime();
            setIsEventEnded(isEnded);
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thời gian sự kiện:", error);
        setEventName("Unknown Event"); // Fallback nếu API lỗi
      }
    };

    if (eventId) {
      checkEventStatus();
    }
  }, [eventId]);

  const feedbackItems = feedbacks?.feedbacks || [];

  // --- LOGIC MỚI: Xử lý tìm kiếm và lọc dữ liệu ---
  const filteredFeedbacks = useMemo(() => {
    let result = feedbackItems;

    // 1. Tìm kiếm theo tên hoặc email
    if (searchTerm.trim() !== "") {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.userName?.toLowerCase().includes(lowerCaseSearch) ||
          item.userEmail?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. Lọc theo số sao (Rating)
    if (ratingFilter !== "all") {
      result = result.filter((item) => item.rating === Number(ratingFilter));
    }

    // 3. Lọc theo ngày (Date)
    if (dateFilter) {
      result = result.filter((item) => {
        const dateObj = new Date(item.createdAt);
        // Định dạng ngày về YYYY-MM-DD để so sánh chuẩn xác với input date
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const formattedItemDate = `${yyyy}-${mm}-${dd}`;
        
        return formattedItemDate === dateFilter;
      });
    }

    return result;
  }, [feedbackItems, searchTerm, ratingFilter, dateFilter]);

  // Cập nhật lại số phân trang dựa trên danh sách đã lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // --- LOGIC MỚI: Reset trang về 1 khi người dùng thay đổi bộ lọc ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRatingChange = (e) => {
    setRatingFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const onChangePage = (page) => {
    setCurrentPage(page);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setTimeout(() => {
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#f8f7f2] font-sans items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">
          Loading feedbacks...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-[#f8f7f2] font-sans items-center justify-center">
        <p className="text-red-500 font-medium">Error loading feedbacks</p>
      </div>
    );
  }

  return (
    // SỬA Ở ĐÂY: Đổi font-serif thành font-sans
    <div className="p-10 w-full overflow-x-hidden font-sans">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8" ref={listTopRef}>
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight mb-1 sm:mb-2">
            Attendee Feedback
          </h1>
          <p className="text-gray-500 font-medium italic text-xs sm:text-sm">
            Showing all responses for{" "}
            <span className="text-gray-800 not-italic font-bold">
              {eventName}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full lg:w-auto">
          {!isEventEnded ? (
            <Link
              to={`/organizer/feedback/createform/${eventId}`}
              className="flex-1 sm:flex-none justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus
                size={16}
                strokeWidth={2.5}
                className="sm:w-[18px] sm:h-[18px]"
              />{" "}
              <span className="whitespace-nowrap">Create Form</span>
            </Link>
          ) : (
            <div className="flex-1 sm:flex-none justify-center bg-red-50 text-red-600 border border-red-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-sm cursor-not-allowed">
              <Lock
                size={16}
                strokeWidth={2.5}
                className="sm:w-[18px] sm:h-[18px]"
              />{" "}
              <span className="whitespace-nowrap">Event Ended</span>
            </div>
          )}
        </div>
      </div>

      {/* --- CẬP NHẬT: TOOLBAR TÌM KIẾM VÀ LỌC --- */}
      <div className="bg-white p-2 rounded-xl sm:rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between border border-gray-100 gap-2 md:gap-4">
        {/* Search Input */}
        <div className="flex items-center px-3 sm:px-4 py-2 flex-1 gap-2 sm:gap-3 w-full border-b md:border-b-0 md:border-r border-gray-100">
          <Search className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-sm font-medium h-full bg-transparent"
          />
        </div>

        {/* Filter Container */}
        <div className="flex items-center gap-4 px-3 py-1 w-full md:w-auto overflow-x-auto">
          {/* Rating Filter */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 whitespace-nowrap">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={ratingFilter}
              onChange={handleRatingChange}
              className="outline-none text-xs sm:text-sm font-medium text-gray-600 bg-transparent cursor-pointer"
            >
              <option value="all">All NPS</option>
              <option value="10">10 - Excellent 😍</option>
              <option value="9">9 - Very Good 😁</option>
              <option value="8">8 - Good 😀</option>
              <option value="7">7 - Satisfied 😊</option>
              <option value="6">6 - Okay 🙂</option>
              <option value="5">5 - Neutral 😐</option>
              <option value="4">4 - Poor 🙁</option>
              <option value="3">3 - Bad 😞</option>
              <option value="2">2 - Very Bad 😠</option>
              <option value="1">1 - Terrible 😡</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 whitespace-nowrap">
            <Calendar className="text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="outline-none text-xs sm:text-sm font-medium text-gray-600 bg-transparent cursor-pointer"
            />
            {/* Nút xóa ngày lọc nhanh */}
            {dateFilter && (
              <button 
                onClick={() => {setDateFilter(""); setCurrentPage(1);}}
                className="ml-1 text-gray-400 hover:text-red-500 font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between border border-gray-100 min-h-[400px] sm:min-h-[500px]">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px]">
            <thead className="bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left whitespace-nowrap">
                  Date & Time
                </th>
                <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">
                  Attendee
                </th>
                <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">
                  Rating
                </th>
                <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">
                  Ticket
                </th>
                <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 sm:py-20">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-400 font-medium text-base sm:text-lg">
                        No feedbacks found.
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.feedbackId}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 lg:px-8 py-4 lg:py-5 text-xs sm:text-sm text-gray-500 font-semibold whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={
                            item.userAvatar ||
                            `https://ui-avatars.com/api/?name=${item.userName}&background=random`
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
                          alt={item.userName}
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {item.userName}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">
                            {item.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-blue-500">{item.rating}</span>
                        <span className="text-base sm:text-lg">/ 10</span>
                        {item.rating > 0 && item.rating <= 10 && (
                          <span className="text-lg sm:text-xl ml-1">{npsEmojis[item.rating - 1]}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5">
                      <span className="inline-block text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase italic tracking-wider text-[#8c9db3] bg-[#f8f7f2] px-2 sm:px-3 py-1 rounded-full border border-gray-100 whitespace-nowrap">
                        {item.ticketName || "General"}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5 text-center">
                      <Link
                        to={`/organizer/feedback/${item.feedbackId}`}
                        className="inline-block text-gray-400 hover:text-[#8c9db3] p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-all"
                      >
                        <Eye size={18} className="sm:w-5 sm:h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- CẬP NHẬT: Đổi tổng số response thành số lượng đã lọc --- */}
        <div className="px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Total Responses:{" "}
            <span className="text-gray-700">{filteredFeedbacks.length}</span>
          </p>
          {filteredFeedbacks.length > itemsPerPage && (
            <Pagination
              align="center"
              responsive
              current={currentPage}
              pageSize={itemsPerPage}
              showSizeChanger={false}
              total={filteredFeedbacks.length}
              onChange={onChangePage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;