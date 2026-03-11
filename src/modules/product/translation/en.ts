export default {
  title: "Product List",
  titleCreate: "Create New Product",
  titleEdit: "Edit Product",
  infoBasic: "Basic Information",
  infoPricing: "Pricing & Inventory",
  infoMedia: "Media",
  infoDescription: "Detail Description",
  seoTitle: "Products",
  seoDescription: "Manage product list in the system",
  addProduct: "Add Product",
  columns: {
    name: "Product Name",
    category: "Category",
    price: "Price",
    action: "Action",
    image: "Image",
    code: "Product Code",
    status: "Status",
    stock: "StockCount",
    index: "#",
    tax: "Tax (%)",
    totalPrice: "Total Price (incl. tax)"
  },
  status: {
    active: "Active",
    inactive: "Inactive"
  },
  form: {
    name: "Product Name",
    price: "Price",
    description: "Description",
    stock: "Stock",
    code: "Product Code",
    category: "Category",
    priceSale: "Selling Price",
    taxPercentage: "Tax (%)",
    status: "Status",
    image: "Product Image"
  },
  placeholder: {
    name: "Enter product name",
    code: "Enter product code",
    price: "Enter selling price",
    description: "Enter product description...",
    category: "Select category"
  },
  validation: {
    required: "{{field}} is required",
    number: "{{field}} must be a number"
  },
  messages: {
    updateStatusSuccess: "Status updated successfully",
    updateStatusError: "Failed to update status",
    createSuccess: "Product created successfully",
    createError: "Failed to create product",
    updateSuccess: "Product updated successfully",
    updateError: "Failed to update product"
  }
};
