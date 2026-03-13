export default {
  title: "Quản lý Đơn hàng",
  messages: {
    deleteSuccess: "Xóa đơn hàng thành công",
    deleteError: "Xóa đơn hàng thất bại",
    batchDeleteSuccess: "Xóa danh sách đơn hàng thành công",
    batchDeleteError: "Xóa danh sách đơn hàng thất bại",
    importSuccess: "Nhập danh sách đơn hàng thành công",
    importError: "Nhập danh sách đơn hàng thất bại",
  },
  columns: {
    index: "STT",
    code: "Mã đơn hàng",
    customer: "Khách hàng",
    totalAmount: "Thành tiền",
    status: "Trạng thái",
    paymentStatus: "Thanh toán",
    createdAt: "Ngày tạo",
    branch: "Chi nhánh",
  },
  filter: {
    custom: "Tùy chỉnh",
    startTime: "Giờ bắt đầu",
    endTime: "Giờ kết thúc",
  }
};
