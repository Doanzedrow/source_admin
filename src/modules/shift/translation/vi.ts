export default {
  title: "Quản lý Ca làm việc",
  addShift: "Thêm Ca làm việc",
  editShift: "Chỉnh sửa Ca làm việc",
  shiftList: "Danh sách Ca làm việc",
  columns: {
    index: "STT",
    name: "Tên ca",
    startTime: "Giờ bắt đầu",
    endTime: "Giờ kết thúc",
    status: "Trạng thái",
    branch: "Chi nhánh",
    action: "Hành động",
  },
  form: {
    name: "Tên ca",
    startTime: "Giờ bắt đầu",
    endTime: "Giờ kết thúc",
    status: "Trạng thái",
    branch: "Chi nhánh",
  },
  filter: {
    keyword: "Tìm theo tên ca...",
    status: "Tất cả trạng thái",
  },
  status: {
    active: "Hoạt động",
    inactive: "Khóa",
  },
  messages: {
    createSuccess: "Thêm ca làm việc thành công",
    createError: "Thêm ca làm việc thất bại",
    updateSuccess: "Cập nhật ca làm việc thành công",
    updateError: "Cập nhật ca làm việc thất bại",
    deleteSuccess: "Xóa ca làm việc thành công",
    deleteError: "Xóa ca làm việc thất bại",
    statusSuccess: "Cập nhật trạng thái thành công",
    statusError: "Cập nhật trạng thái thất bại",
  }
};
