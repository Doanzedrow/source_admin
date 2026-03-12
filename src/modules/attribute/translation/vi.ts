export default {
  title: "Danh sách biến thể",
  titleCreate: "Thêm biến thể mới",
  titleEdit: "Chỉnh sửa biến thể",
  columns: {
    name: "Tên biến thể",
    code: "Mã biến thể",
    isMultiple: "Nhiều giá trị",
    overridePrice: "Ghi đè giá",
    status: "Trạng thái",
    action: "Hành động",
    index: "#",
    maxSelect: "Chọn tối đa",
    variants: "Giá trị",
    createdAt: "Ngày tạo"
  },
  filter: {
    keyword: "Tìm theo tên, mã biến thể",
    status: "Tất cả trạng thái",
    branch: "Tất cả chi nhánh",
  },
  status: {
    active: "Hoạt động",
    inactive: "Ngừng hoạt động"
  },
  form: {
    name: "Tên biến thể",
    code: "Mã biến thể",
    isMultiple: "Cho phép chọn nhiều giá trị",
    overridePrice: "Cấu hình ghi đè giá",
    isMultipleDesc: "Cho phép khách hàng chọn nhiều giá trị cùng lúc (VD: Nhiều loại Topping)",
    overridePriceDesc: "Giá sản phẩm sẽ được thay đổi dựa trên giá trị của biến thể này",
    status: "Trạng thái",
    maxSelect: "Số lượng chọn tối đa",
    variants: "Danh sách giá trị biến thể",
    addVariant: "Thêm giá trị",
    variantName: "Tên giá trị (VD: Đỏ, XL...)",
    variantCode: "Mã (VD: RED, XL...)",
    addVariantTip: "Vui lòng lưu thông tin biến thể chính trước khi thêm các giá trị (Màu sắc, Kích thước...)",
    attribute: "Thuộc tính",
    variant: "Giá trị",
    price: "Giá bán",
    image: "Ảnh đại diện",
  },
  placeholder: {
    name: "Nhập tên chính (VD: Màu sắc)",
    code: "Nhập mã chính (VD: MAUSAC)",
    selectAttribute: "Chọn thuộc tính",
  },
  validation: {
    required: "{{field}} là bắt buộc",
  },
  messages: {
    createSuccess: "Thêm biến thể thành công",
    createError: "Thêm biến thể thất bại",
    updateSuccess: "Cập nhật biến thể thành công",
    updateError: "Cập nhật biến thể thất bại",
    deleteSuccess: "Xóa biến thể thành công",
    deleteError: "Xóa biến thể thất bại",
    deleteConfirm: "Bạn có chắc chắn muốn xóa biến thể này?",
  }
};
