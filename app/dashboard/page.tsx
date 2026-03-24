async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const res = await fetch(`${baseUrl}/api/stats`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch stats");
      return { totalSubscribers: 0 };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { totalSubscribers: 0 };
  }
}

export default async function Dashboard() {
  const data = await getStats();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Dashboard
      </h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          width: "250px",
        }}
      >
        <h2>Total Subscribers</h2>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          {data.totalSubscribers}
        </p>
      </div>
    </div>
  );
}