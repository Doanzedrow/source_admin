export default {
  title: "Danh mục sản phẩm",
  titleCreate: "Thêm danh mục mới",
  titleEdit: "Chỉnh sửa danh mục",
  seoTitle: "Danh mục",
  seoDescription: "Quản lý danh mục sản phẩm của hệ thống.",
  addCategory: "Thêm danh mục",
  columns: {
    index: "#",
    name: "Tên danh mục",
    code: "Mã danh mục",
    totalProduct: "Số sản phẩm",
    type: "Loại danh mục",
    status: "Trạng thái",
    action: "Hành động",
  },
  type: {
    product: "Sản phẩm",
    service: "Dịch vụ",
  },
  filter: {
    keyword: "Tìm theo tên, mã danh mục",
    status: "Tất cả trạng thái",
    branch: "Tất cả chi nhánh",
  },
  status: {
    active: "Hoạt động",
    inactive: "Ngừng hoạt động",
  },
  form: {
    name: "Tên danh mục",
    code: "Mã danh mục",
    slug: "Đường dẫn (Slug)",
    type: "Loại danh mục",
    description: "Mô tả",
    status: "Trạng thái hoạt động",
  },
  placeholder: {
    name: "Nhập tên danh mục",
    code: "Nhập mã danh mục",
    slug: "duong-dan-tu-dong",
    type: "Chọn loại danh mục",
    description: "Nhập mô tả danh mục...",
  },
  validation: {
    required: "{{field}} là bắt buộc",
  },
  messages: {
    deleteSuccess: "Xóa danh mục thành công",
    deleteError: "Xóa danh mục thất bại",
    updateStatusSuccess: "Cập nhật trạng thái thành công",
    updateStatusError: "Cập nhật trạng thái thất bại",
    deleteConfirm: "Bạn có chắc chắn muốn xóa danh mục này?",
    createSuccess: "Thêm danh mục thành công",
    createError: "Thêm danh mục thất bại",
    updateSuccess: "Cập nhật danh mục thành công",
    updateError: "Cập nhật danh mục thất bại",
  }
};
