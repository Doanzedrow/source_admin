export default {
  title: "Product Attributes",
  titleCreate: "Create Attribute",
  titleEdit: "Edit Attribute",
  columns: {
    name: "Attribute Name",
    code: "Attribute Code",
    isMultiple: "Multi Select",
    overridePrice: "Override Price",
    status: "Status",
    action: "Action",
    index: "#"
  },
  filter: {
    keyword: "Search by name, code",
    status: "All status",
  },
  status: {
    active: "Active",
    inactive: "Inactive"
  },
  form: {
    name: "Attribute Name",
    code: "Attribute Code",
    isMultiple: "Allow multiple selection",
    overridePrice: "Allow override price",
    status: "Status",
  },
  placeholder: {
    name: "Enter attribute name (e.g., Color)",
    code: "Enter attribute code (e.g., COLOR)",
  },
  validation: {
    required: "{{field}} is required",
  },
  messages: {
    createSuccess: "Create attribute successfully",
    createError: "Failed to create attribute",
    updateSuccess: "Update attribute successfully",
    updateError: "Failed to update attribute",
    deleteSuccess: "Delete attribute successfully",
    deleteError: "Failed to delete attribute",
    deleteConfirm: "Are you sure you want to delete this attribute?",
  }
};
