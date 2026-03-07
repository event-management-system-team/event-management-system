import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UrgencyTimer from "../../components/domain/checkout/UrgencyTimer";
import TicketReview from "../../components/domain/checkout/TicketReview";
import CustomerInfo from "../../components/domain/checkout/CustomerInfo";
import PaymentMethods from "../../components/domain/checkout/PaymentMethods";
import OrderSummary from "../../components/domain/checkout/OrderSummary";
import {
  createOrder,
  createPaymentUrl,
  clearBooking,
} from "../../store/slices/booking.slice";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedTickets, selectedEvent, reservation, loading } = useSelector(
    (state) => state.booking,
  );
  const { user } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(0);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [formErrors, setFormErrors] = useState({});

  const subTotal =
    selectedTickets?.reduce((sum, t) => sum + t.price * t.quantity, 0) || 0;

  useEffect(() => {
    // Free tickets have no reservation — only block paid tickets missing reservation
    if (!selectedTickets?.length || (!reservation && subTotal > 0)) {
      navigate(-1);
    }
  }, [reservation, selectedTickets, subTotal]);

  useEffect(() => {
    if (!reservation?.expiresAt) return;

    const expiresAt = new Date(reservation.expiresAt).getTime();

    const timer = setInterval(() => {
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        dispatch(clearBooking());
        navigate(-1);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Invalid email format";
    return errors;
  };

  const handleConfirmAndPay = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const ticket = selectedTickets[0];
    try {
      const orderResult = await dispatch(
        createOrder({
          ticketTypeId: ticket.ticketTypeId,   // null for free events
          eventId: selectedEvent?.eventId,      // required for free events
          quantity: ticket.quantity,
          fullName: form.fullName,
          email: form.email,
        }),
      ).unwrap();

      // Free ticket: already confirmed by backend — skip VNPay
      if (orderResult.free) {
        dispatch(clearBooking());
        navigate(`/payment/success?orderCode=${orderResult.orderCode}`);
        return;
      }

      // Paid ticket: redirect to VNPay
      const paymentResult = await dispatch(
        createPaymentUrl(orderResult.orderCode),
      ).unwrap();

      window.location.href = paymentResult.paymentUrl;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <UrgencyTimer time={formatTime(timeLeft)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <TicketReview event={selectedEvent} tickets={selectedTickets} />
            <CustomerInfo
              form={form}
              setForm={setForm}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
            />
            <PaymentMethods
              isFree={subTotal === 0}
              event={selectedEvent}
              tickets={selectedTickets}
              subTotal={subTotal}
              loading={loading}
              onConfirm={handleConfirmAndPay}
            />
          </div>
          <div className="lg:col-span-4">
            <OrderSummary
              event={selectedEvent}
              tickets={selectedTickets}
              subTotal={subTotal}
              loading={loading}
              onConfirm={handleConfirmAndPay}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
