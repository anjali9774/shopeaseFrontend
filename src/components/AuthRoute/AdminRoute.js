import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../redux/slices/users/usersSlice";
import AdminOnly from "../NotAuthorised/AdminOnly";

const AdminRoutes = ({ children }) => {
  console.log("Rendering AdminRoutes");

  // Dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Dispatching getUserProfileAction");
    dispatch(getUserProfileAction());
  }, [dispatch]);

  // Get user from store
  const { userAuth } = useSelector((state) => state.users);
  console.log("User from store:", userAuth);

  // Check if user is admin
  const isAdmin = userAuth?.userInfo?.user?.isAdmin;
  console.log("isAdmin:", isAdmin);

  if (!isAdmin) {
    console.log("User is not admin. Rendering AdminOnly");
    return <AdminOnly />;
  }

  console.log("User is admin. Rendering children");
  return <>{children}</>;
};

export default AdminRoutes;
