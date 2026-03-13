export default {
  title: "Variants List",
  titleCreate: "Create New Variant",
  titleEdit: "Edit Variant",
  columns: {
    name: "Variant Name",
    code: "Variant Code",
    isMultiple: "Multi Select",
    overridePrice: "Override Price",
    status: "Status",
    action: "Action",
    index: "#",
    maxSelect: "Max Select",
    variants: "Values",
    createdAt: "Created At"
  },
  filter: {
    keyword: "Search by name, code",
    status: "All Status",
    branch: "All Branches",
  },
  status: {
    active: "Active",
    inactive: "Inactive"
  },
  form: {
    name: "Variant Name",
    code: "Variant Code",
    isMultiple: "Allow multiple selection",
    overridePrice: "Allow override price",
    isMultipleDesc: "Allow customers to select multiple values (e.g., Multiple Toppings)",
    overridePriceDesc: "Product price will be modified based on this variant's value",
    status: "Status",
    maxSelect: "Max selection count",
    variants: "Variant values list",
    addVariant: "Add Value",
    variantName: "Value Name (e.g., Red, XL...)",
    variantCode: "Code (e.g., RED, XL...)",
    addVariantTip: "Please save the main variant information before adding specific values (Color, Size...).",
  },
  placeholder: {
    name: "Enter main name (e.g., Color)",
    code: "Enter main code (e.g., COLOR)",
  },
  validation: {
    required: "{{field}} is required",
  },
  messages: {
    createSuccess: "Create variant successfully",
    createError: "Failed to create variant",
    updateSuccess: "Update variant successfully",
    updateError: "Failed to update variant",
    deleteSuccess: "Delete variant successfully",
    deleteError: "Failed to delete variant",
    deleteConfirm: "Are you sure you want to delete this variant?",
    importSuccess: "Variant imported successfully",
    importError: "Failed to import variant"
  }
};
