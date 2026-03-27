import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoRefreshToken } from "./store/slices/auth.slice";

import AppRoutes from "./routes";
import LoadingState from "./components/common/LoadingState";

// Refresh 1 minute before the access token expires
const REFRESH_BEFORE_EXPIRY_MS = 60 * 1000;

function App() {
  const hasRefreshed = useRef(false);
  const refreshTimerRef = useRef(null);
  const dispatch = useDispatch();
  const { appLoading, tokenExpiresAt, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  // Initial auto-refresh on mount (restore session from refresh token cookie)
  useEffect(() => {
    if (hasRefreshed.current) return;
    hasRefreshed.current = true;
    dispatch(autoRefreshToken());
  }, [dispatch]);

  // Proactive refresh timer: schedule a refresh ~1 min before access token expires
  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!isAuthenticated || !tokenExpiresAt) return;

    const now = Date.now();
    const msUntilRefresh = tokenExpiresAt - now - REFRESH_BEFORE_EXPIRY_MS;

    if (msUntilRefresh <= 0) {
      dispatch(autoRefreshToken());
    } else {
      refreshTimerRef.current = setTimeout(() => {
        dispatch(autoRefreshToken());
      }, msUntilRefresh);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [tokenExpiresAt, isAuthenticated, dispatch]);

  if (appLoading) {
    return <LoadingState />;
  }

  return <AppRoutes />;
}

export default App;

