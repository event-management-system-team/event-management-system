// import ... (giữ nguyên các import cũ nếu sau này dùng thật)

export const useFeedbackList = (eventId) => {
  // 👇 TẠM THỜI: Comment dòng gọi API thật lại
  /*
  const { data, isLoading, ... } = useQuery({ ... });
  */

  // 👇 DÙNG CÁI NÀY: Dữ liệu giả để test giao diện
  const fakeData = [
    {
      id: 1,
      userAvatar: "https://i.pravatar.cc/150?img=1", // Avatar ngẫu nhiên
      userName: "Nguyễn Văn A",
      rating: 5,
      comment: "Sự kiện tổ chức rất chuyên nghiệp, check-in nhanh!",
      createdAt: "2023-10-20T08:30:00Z"
    },
    {
      id: 2,
      userAvatar: "https://i.pravatar.cc/150?img=5",
      userName: "Trần Thị B",
      rating: 4,
      comment: "Nội dung hay nhưng điều hòa hội trường hơi lạnh.",
      createdAt: "2023-10-20T09:15:00Z"
    },
    {
      id: 3,
      userAvatar: null, // Test trường hợp không có avatar
      userName: "Lê C",
      rating: 2,
      comment: "Âm thanh bị rè, ngồi sau không nghe rõ.",
      createdAt: "2023-10-21T10:00:00Z"
    }
  ];

  // Giả vờ loading 1 giây cho giống thật
  // (Trong thực tế bạn không cần setTimeout này, đây chỉ là trick để test Loading UI)
  const isLoading = false; 

  return {
    feedbackList: fakeData, // Trả về data giả
    isLoading: isLoading,
    hasError: false,
    errorMessage: "",
  };
};

// ... giữ nguyên phần useToggleFeedback