interface DigitalEyesAnimatedIconProps {
  background?: string;
  color?: string;
  className?: string;
}

export const DigitalEyesAnimatedIcon: React.FC<DigitalEyesAnimatedIconProps> = ({
  background,
  color,
  ...rest
}) => {
  return (
    <svg
      width="187"
      height="96"
      viewBox="0 0 187 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="187" height="96" rx="48" fill={color ? color : "white"} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M138 82C156.778 82 172 66.7777 172 48C172 29.2223 156.778 14 138 14C119.222 14 104 29.2223 104 48C104 66.7777 119.222 82 138 82ZM138 90C161.196 90 180 71.196 180 48C180 24.804 161.196 6 138 6C114.804 6 96 24.804 96 48C96 71.196 114.804 90 138 90Z"
        fill={background ? background : "#000"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49 82C67.7777 82 83 66.7777 83 48C83 29.2223 67.7777 14 49 14C30.2223 14 15 29.2223 15 48C15 66.7777 30.2223 82 49 82ZM49 90C72.196 90 91 71.196 91 48C91 24.804 72.196 6 49 6C25.804 6 7 24.804 7 48C7 71.196 25.804 90 49 90Z"
        fill={background ? background : "#000"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59 71C64.5228 71 69 64.5081 69 56.5C69 48.4919 64.5228 42 59 42C53.4772 42 49 48.4919 49 56.5C49 64.5081 53.4772 71 59 71ZM61 60C63.2091 60 65 57.0899 65 53.5C65 49.9101 63.2091 47 61 47C58.7909 47 57 49.9101 57 53.5C57 57.0899 58.7909 60 61 60Z"
        fill={background ? background : "#000"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M151 71C156.523 71 161 64.5081 161 56.5C161 48.4919 156.523 42 151 42C145.477 42 141 48.4919 141 56.5C141 64.5081 145.477 71 151 71ZM153 60C155.209 60 157 57.0899 157 53.5C157 49.9101 155.209 47 153 47C150.791 47 149 49.9101 149 53.5C149 57.0899 150.791 60 153 60Z"
        fill={background ? background : "#000"}
      />
    </svg>
  );
};
