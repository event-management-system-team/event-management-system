// store/slices/booking.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../../services/booking.service";

export const reserveTickets = createAsyncThunk(
  "booking/reserve",
  async ({ ticketTypeId, quantity }, { rejectWithValue }) => {
    try {
      const data = await bookingService.reserveTickets(ticketTypeId, quantity);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể giữ chỗ",
      );
    }
  },
);

export const createOrder = createAsyncThunk(
  "booking/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await bookingService.createOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tạo đơn hàng",
      );
    }
  },
);

export const createPaymentUrl = createAsyncThunk(
  "booking/createPaymentUrl",
  async (orderCode, { rejectWithValue }) => {
    try {
      const data = await bookingService.createPaymentUrl(orderCode);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tạo link thanh toán",
      );
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    selectedTickets: [],
    reservation: null,
    selectedEvent: null,
    currentOrder: null,
    paymentUrl: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTickets: (state, action) => {
      state.selectedTickets = action.payload;
    },

    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },

    clearBooking: (state) => {
      state.selectedTickets = [];
      state.reservation = null;
      state.selectedEvent = null;
      state.currentOrder = null;
      state.paymentUrl = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reserve
      .addCase(reserveTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reserveTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.reservation = action.payload;
      })
      .addCase(reserveTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPaymentUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(createPaymentUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedTickets,
  setSelectedEvent,
  clearBooking,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
