import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ClientPortal = ({ children, show }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = document.getElementById("portal");
  }, []);
  return show && ref.current ? createPortal(children, ref.current) : null;
};
export default ClientPortal;
