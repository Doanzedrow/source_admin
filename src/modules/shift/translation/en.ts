export default {
  title: "Shift Management",
  addShift: "Add Shift",
  editShift: "Edit Shift",
  shiftList: "Shift List",
  columns: {
    index: "No.",
    name: "Shift Name",
    startTime: "Start Time",
    endTime: "End Time",
    status: "Status",
    branch: "Branch",
    action: "Action",
  },
  form: {
    name: "Shift Name",
    startTime: "Start Time",
    endTime: "End Time",
    status: "Status",
    branch: "Branch",
  },
  filter: {
    keyword: "Search by shift name...",
    status: "All Status",
  },
  status: {
    active: "Active",
    inactive: "Locked",
  },
  messages: {
    createSuccess: "Shift created successfully",
    createError: "Failed to create shift",
    updateSuccess: "Shift updated successfully",
    updateError: "Failed to update shift",
    deleteSuccess: "Shift deleted successfully",
    deleteError: "Failed to delete shift",
    statusSuccess: "Status updated successfully",
    statusError: "Failed to update status",
  }
};
