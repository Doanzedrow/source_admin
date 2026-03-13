export default {
  title: "Order Management",
  messages: {
    deleteSuccess: "Order deleted successfully",
    deleteError: "Failed to delete order",
    batchDeleteSuccess: "Orders deleted successfully",
    batchDeleteError: "Failed to delete orders",
    importSuccess: "Orders imported successfully",
    importError: "Failed to import orders",
  },
  columns: {
    index: "No.",
    code: "Order Code",
    customer: "Customer",
    totalAmount: "Total Amount",
    status: "Status",
    paymentStatus: "Payment",
    createdAt: "Created At",
    branch: "Branch",
  },
  filter: {
    custom: "Custom",
  }
};
