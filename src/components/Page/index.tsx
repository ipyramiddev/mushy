import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Page = (props: any) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = props.title || "DigitalEyes Market";
  }, [props.title]);

  return <div {...props}>{props.children}</div>;
};
