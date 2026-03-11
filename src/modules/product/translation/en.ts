export default {
  title: "Product List",
  seoTitle: "Products",
  seoDescription: "Manage list of services and products at Thanh Xuan SPA.",
  addProduct: "Add Product",
  columns: {
    name: "Product Name",
    category: "Category",
    price: "Selling Price",
    action: "Action",
    image: "Image",
    code: "Product Code",
    status: "Status",
    stock: "Stock",
    index: "#",
    tax: "Tax (%)",
    totalPrice: "Price (incl. tax)"
  },
  status: {
    active: "Active",
    inactive: "Inactive"
  },
  form: {
    name: "Product Name",
    price: "Price",
    description: "Description",
    stock: "Stock"
  },
  messages: {
    updateStatusSuccess: "Status updated successfully",
    updateStatusError: "Failed to update status"
  }
};
