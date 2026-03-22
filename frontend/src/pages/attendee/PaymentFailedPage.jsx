import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FailedHero from "../../components/domain/payment-status/FailedHero";
import FailedReasons from "../../components/domain/payment-status/FailedReasons";
import FailedActions from "../../components/domain/payment-status/FailedActions";

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const orderCode = searchParams.get("orderCode");
  const errorCode = searchParams.get("code");

  const VNPAY_ERROR_KEYS = {
    "07": "vnpay_error_07",
    "09": "vnpay_error_09",
    "10": "vnpay_error_10",
    "11": "vnpay_error_11",
    "12": "vnpay_error_12",
    "13": "vnpay_error_13",
    "24": "vnpay_error_24",
    "51": "vnpay_error_51",
    "65": "vnpay_error_65",
    "75": "vnpay_error_75",
    "79": "vnpay_error_79",
  };

  const errorKey = VNPAY_ERROR_KEYS[errorCode];
  const errorMessage = errorKey
    ? t(errorKey)
    : errorCode
      ? t("vnpay_error_default", { code: errorCode })
      : t("vnpay_error_unknown");

  return (
    <div className="bg-[#F1F0E8] font-sans min-h-screen text-[#131516]">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-[800px] mx-auto w-full">
        <FailedHero errorMessage={errorMessage} />
        <FailedReasons />
        <FailedActions
          onTryAgain={() => navigate("/events")}
          onContactSupport={() =>
            (window.location.href = "mailto:support@eventhub.vn")
          }
        />
        {orderCode && (
          <p className="mt-8 text-slate-400 text-sm">
            {t("reference_order_code")}{" "}
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
