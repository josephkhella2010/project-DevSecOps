import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect } from "react";

export default function HomePage() {
  const { users } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "Fetch-USERS" });
  }, [dispatch]);
  console.log(users);
  return <div>HomePage</div>;
}
