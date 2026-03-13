export default {
  permissionList: "Permission List",
  addPermission: "Add New Permission",
  editPermission: "Edit Permission",
  columns: {
    index: "#",
    name: "Permission Name",
    module: "Module",
    actions: "Configured Actions",
    action: "Action",
    status: "Status"
  },
  fields: {
    name: "Permission Name",
    module: "Module",
    status: "Active Status"
  },
  placeholders: {
    name: "E.g: Product Management",
    module: "E.g: product"
  },
  sections: {
    actions: "Allowed Actions",
    info: "Permission Information"
  },
  messages: {
    createSuccess: "Permission created successfully",
    updateSuccess: "Permission updated successfully",
    deleteSuccess: "Permission deleted successfully",
    updateStatusSuccess: "Status updated successfully",
    error: "An error occurred, please try again later"
  },
  validation: {
    required: "{{field}} is required"
  }
};
