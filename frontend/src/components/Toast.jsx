import { C } from "./styles";

export default function Toast({ msg, type }) {
  if (!msg) return null;
  const isErr = type === "error";
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "10px 16px",
        borderRadius: "10px",
        background: isErr ? C.red2 : C.green2,
        color: isErr ? C.red : C.green,
        fontWeight: "500",
        fontSize: "14px",
        animation: "fadeIn .3s ease",
      }}
    >
      {isErr ? "❌ " : "✅ "}
      {msg}
    </div>
  );
}
