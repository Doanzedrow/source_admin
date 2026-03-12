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
    status: "All Status",
    branch: "All Branches",
  },
  status: {
    active: "Active",
    inactive: "Inactive",
  },
  form: {
    name: "Category Name",
    code: "Category Code",
    slug: "Slug",
    type: "Category Type",
    description: "Description",
    status: "Active Status",
  },
  placeholder: {
    name: "Enter category name",
    code: "Enter category code",
    slug: "automatic-slug",
    type: "Select category type",
    description: "Enter category description...",
  },
  validation: {
    required: "{{field}} is required",
  },
  messages: {
    deleteSuccess: "Category deleted successfully",
    deleteError: "Failed to delete category",
    updateStatusSuccess: "Status updated successfully",
    updateStatusError: "Failed to update status",
    deleteConfirm: "Are you sure you want to delete this category?",
    createSuccess: "Category created successfully",
    createError: "Failed to create category",
    updateSuccess: "Category updated successfully",
    updateError: "Failed to update category",
  }
};
