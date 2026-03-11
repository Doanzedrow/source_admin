export default {
  title: "Product Categories",
  titleCreate: "Add New Category",
  titleEdit: "Edit Category",
  seoTitle: "Categories",
  seoDescription: "Manage product categories in the system.",
  addCategory: "Add Category",
  columns: {
    index: "#",
    name: "Category Name",
    code: "Category Code",
    totalProduct: "Products",
    type: "Category Type",
    status: "Status",
    action: "Action",
  },
  type: {
    product: "Product",
    service: "Service",
  },
  filter: {
    keyword: "Search by name, code",
    status: "All status",
  },
  status: {
    active: "Active",
    inactive: "Inactive",
  },
  messages: {
    deleteSuccess: "Category deleted successfully",
    deleteError: "Failed to delete category",
    updateStatusSuccess: "Status updated successfully",
    updateStatusError: "Failed to update status",
    deleteConfirm: "Are you sure you want to delete this category?",
  }
};
