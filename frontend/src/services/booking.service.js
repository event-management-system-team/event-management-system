import axiosInstance from "../config/axios";

const bookingService = {
  reserveTickets: async (ticketTypeId, quantity) => {
    const response = await axiosInstance.post("/booking/reserve", {
      ticketTypeId,
      quantity,
    });
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await axiosInstance.post("/booking/orders", orderData);
    return response.data;
  },

  createPaymentUrl: async (orderCode) => {
    const response = await axiosInstance.post(
      `/payments/vnpay/create?orderCode=${orderCode}`,
    );
    return response.data;
  },

  getMyTickets: async () => {
    const response = await axiosInstance.get("/tickets/my-tickets");
    return response.data;
  },

  getTicketDetail: async (ticketId) => {
    const response = await axiosInstance.get(`/tickets/my-tickets/${ticketId}`);
    return response.data;
  },
};

export default bookingService;
