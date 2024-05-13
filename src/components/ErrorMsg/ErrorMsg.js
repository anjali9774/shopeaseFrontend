import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { resetErrAction } from "../../redux/slices/globalActions/globalActions";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
  useEffect(() => {
    dispatch(resetErrAction());
  }, [dispatch]);
};

export default ErrorMsg;
