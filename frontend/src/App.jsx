import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoRefreshToken } from "./store/slices/auth.slice";

import AppRoutes from "./routes";

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
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;