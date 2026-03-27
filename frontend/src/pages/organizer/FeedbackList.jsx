import React, { useState, useEffect, useRef } from "react";
import { Eye, Search, Filter, Calendar, Plus, Lock } from "lucide-react";
import { useFeedbacks } from "../../hooks/useFeedback";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import axiosInstance from "../../config/axios";

import { ArrowLeft } from "lucide-react";

const FeedbackList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: feedbacks, isLoading, isError } = useFeedbacks(eventId);


  // --- STATE MỚI: Quản lý các bộ lọc ---
  const [eventName, setEventName] = useState("Loading...");
  

  // EFFECT: Gọi API lấy chi tiết Event để check endDate và lấy tên event
  useEffect(() => {
    const checkEventStatus = async () => {
      try {
        const response = await axiosInstance.get(`/organizer/events/${eventId}`);
        const eventData = response.data?.data || response.data;

        if (eventData) {
          // --- THÊM DÒNG NÀY ---
          // Thay .name bằng .title hoặc .eventName tùy thuộc vào cấu trúc Backend của bạn trả về
          setEventName(eventData.name || eventData.title || eventData.eventName || "Unknown Event");
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


  // STATE: Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const listTopRef = useRef(null);

  // HANDLERS
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F1F0E8] font-sans items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">
          Loading feedbacks...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-[#F1F0E8] font-sans items-center justify-center">
        <p className="text-red-500 font-medium">Error loading feedbacks</p>
      </div>
    );
  }

  const resolvedEventName = eventName || feedbacks?.eventName || "Event";
  const feedbackItems = feedbacks?.feedbacks || [];

  // COMPUTE: filteredFeedbacks
  const filteredFeedbacks = feedbackItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || item.rating === Number(ratingFilter);
    const matchesDate =
      !dateFilter ||
      new Date(item.createdAt).toLocaleDateString("en-CA") === dateFilter;
    return matchesSearch && matchesRating && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    // SỬA Ở ĐÂY: Đổi font-serif thành font-sans
    <div className="p-10 w-full overflow-x-hidden font-sans">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8" ref={listTopRef}>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-gray-400 hover:text-gray-700 text-sm font-medium mb-3 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">
            Attendee Feedback
          </h1>
          </button>
          <p className="text-gray-500 font-medium italic text-xs sm:text-sm">
            Showing all responses for{" "}
            <span className="text-gray-800 not-italic font-bold">
              {resolvedEventName}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full lg:w-auto">
<<<<<<< HEAD
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
              <span className="whitespace-nowrap">Create Feedback Form</span>
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
=======
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
>>>>>>> develop
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
                  Score
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
                      <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-base font-extrabold text-[#8c9db3]">{item.rating}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">/ 10</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5">
                      <span className="inline-block text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase italic tracking-wider text-[#8c9db3] bg-[#F1F0E8] px-2 sm:px-3 py-1 rounded-full border border-gray-100 whitespace-nowrap">
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