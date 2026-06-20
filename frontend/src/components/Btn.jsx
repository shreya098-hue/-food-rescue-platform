import { useState } from "react";
import { s } from "./styles";

export default function Btn({
  bg = "#16a34a",
  color,
  onClick,
  children,
  style,
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{
        ...s.btn(bg, color),
        opacity: hover ? 0.85 : 1,
        transform: hover ? "translateY(-1px)" : "none",
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
