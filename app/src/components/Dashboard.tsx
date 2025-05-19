import LinkButton from "./LinkButton";

const Dashboard = () => {
  const user = { name: "John Doe" };

  return (
    <>
      <h2>{user.name}</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            background: "var(--beige)",
            width: "100%",
            height: "100%",
            padding: "0 20px 20px 20px",
          }}
        >
          <h3>Dashboard</h3>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <div style={{ padding: "1rem", border: "2px solid #000" }}>
                <h3 style={{ margin: 0, padding: 0 }}>C230-1</h3>
                <p style={{ margin: 0, padding: 0 }}>20.5.2025 9:00 - 10:00</p>
              </div>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <div style={{ padding: "1rem", border: "2px solid #000" }}>
                <h3 style={{ margin: 0, padding: 0 }}>C230-1</h3>
                <p style={{ margin: 0, padding: 0 }}>20.5.2025 9:00 - 10:00</p>
              </div>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <div style={{ padding: "1rem", border: "2px solid #000" }}>
                <h3 style={{ margin: 0, padding: 0 }}>C230-1</h3>
                <p style={{ margin: 0, padding: 0 }}>20.5.2025 9:00 - 10:00</p>
              </div>
            </li>
          </ul>
        </div>
        <div
          style={{
            background: "var(--white)",
            width: "100%",
            height: "100%",
            transform: "translateY(50%)",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <LinkButton label="Work Pods" href="#" />
            </li>
            <li style={{ marginBottom: "10px" }}>
              <LinkButton label="Read QR" href="#" />
            </li>
            <li>
              <LinkButton label="Reservations" href="#" />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
