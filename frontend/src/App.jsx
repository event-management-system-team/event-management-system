import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoRefreshToken } from "./store/slices/auth.slice";

import AppRoutes from "./routes";
import LoadingState from "./components/common/LoadingState";
import StatCards from "./components/domain/feedback-analytic/StatCards";
import RatingBarChart from "./components/domain/feedback-analytic/RatingBarChart";
import ReviewsList from "./components/domain/feedback-analytic/ReviewsList";
import FeedbackAnalytics from "./pages/organizer/FeedbackAnalytics";

function App() {
  const hasRefreshed = useRef(false);
  const dispatch = useDispatch();
  const { appLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (hasRefreshed.current) return;
    hasRefreshed.current = true;
    dispatch(autoRefreshToken());
  }, [dispatch]);

  if (appLoading) {
    return <LoadingState />;
  }

  return <AppRoutes />;
}

/*function App() {
  return <FeedbackAnalytics />;
}*/

export default App;
