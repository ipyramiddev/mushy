import { classNames } from "../../utils";

import "./styles.css";

interface DividerProps {
  rounded?: boolean;
}

export const Divider: React.FunctionComponent<DividerProps> = ({ rounded }) => {
  return (
    <hr
      className={classNames(rounded ? "rounded-lg" : "", "border-0 m-0 h-1 de-animated-underline")}
    />
  );
};
