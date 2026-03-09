import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoRefreshToken } from "./store/slices/auth.slice";

import AppRoutes from "./routes";
import LoadingState from "./components/common/LoadingState";

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

export default App;
