export default {
  roleList: "Role List",
  addRole: "Add New Role",
  editRole: "Edit Role",
  columns: {
    index: "#",
    name: "Role Name",
    description: "Description",
    status: "Status",
    action: "Actions"
  },
  fields: {
    name: "Role Name",
    description: "Description",
    status: "Status",
    permissions: "Assigned Permissions"
  },
  placeholders: {
    name: "E.g: Admin, Cashier",
    description: "Enter detailed description for this role"
  },
  messages: {
    createSuccess: "Role created successfully",
    updateSuccess: "Role updated successfully",
    deleteSuccess: "Role deleted successfully",
    loadError: "Failed to load roles",
    updateStatusSuccess: "Status updated successfully"
  },
  validation: {
    nameRequired: "Please enter role name"
  }
};
