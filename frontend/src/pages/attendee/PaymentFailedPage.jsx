import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FailedHero from "../../components/domain/payment-status/FailedHero";
import FailedReasons from "../../components/domain/payment-status/FailedReasons";
import FailedActions from "../../components/domain/payment-status/FailedActions";

const VNPAY_ERRORS = {
  "07": "Giao dịch bị nghi ngờ gian lận",
  "09": "Thẻ/Tài khoản chưa đăng ký InternetBanking",
  10: "Xác thực thông tin thẻ sai quá 3 lần",
  11: "Đã hết hạn chờ thanh toán",
  12: "Thẻ/Tài khoản bị khóa",
  13: "Sai mật khẩu OTP",
  24: "Giao dịch bị hủy bởi người dùng",
  51: "Tài khoản không đủ số dư",
  65: "Vượt quá hạn mức giao dịch trong ngày",
  75: "Ngân hàng đang bảo trì",
  79: "Nhập sai mật khẩu thanh toán quá số lần",
};

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = searchParams.get("orderCode");
  const errorCode = searchParams.get("code");

  const errorMessage =
    VNPAY_ERRORS[errorCode] ||
    (errorCode
      ? `Giao dịch thất bại (mã lỗi: ${errorCode})`
      : "Giao dịch không thể được xử lý tại thời điểm này");

  return (
    <div className="bg-[#F8F6F6] font-sans min-h-screen text-[#131516]">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-[800px] mx-auto w-full">
        <FailedHero errorMessage={errorMessage} />
        <FailedReasons />
        <FailedActions
          onTryAgain={() => navigate(-2)}
          onContactSupport={() =>
            (window.location.href = "mailto:support@eventhub.vn")
          }
        />
        {orderCode && (
          <p className="mt-8 text-slate-400 text-sm">
            Reference Order Code:{" "}
            <span className="font-mono font-semibold text-slate-500">
              {orderCode}
            </span>
          </p>
        )}
      </main>
    </div>
  );
};

export default PaymentFailedPage;
