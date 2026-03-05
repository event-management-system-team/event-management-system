import React from "react";
import Header from "../../components/common/attendee/Header";
import Footer from "../../components/common/Footer";
import UrgencyTimer from "../../components/domain/checkout/UrgencyTimer";
import TicketReview from "../../components/domain/checkout/TicketReview";
import CustomerInfo from "../../components/domain/checkout/CustomerInfo";
import PaymentMethods from "../../components/domain/checkout/PaymentMethods";
import OrderSummary from "../../components/domain/checkout/OrderSummary";

const CheckoutPage = () => {
  return (
    <div className="bg-[#F1F0E8] min-h-screen">
      <Header />
      <UrgencyTimer time="09:58" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <TicketReview />
            <CustomerInfo />
            <PaymentMethods />
          </div>
          <div className="lg:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
