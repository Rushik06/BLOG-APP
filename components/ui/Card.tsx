export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "10px",
        padding: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}