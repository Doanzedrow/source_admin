const Dashboard = () => {
  return (
    <div>
      <h1>Báo cáo tổng hợp</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ background: 'var(--bg-color)', padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <h3>Doanh thu: 50.000.000đ</h3>
        </li>
        <li style={{ background: 'var(--bg-color)', padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <h3>Đơn hàng mới: 120</h3>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
