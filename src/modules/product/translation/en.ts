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
    category: "Product Type",
    priceSale: "Original Price",
    priceAfterTax: "Price After Tax",
    taxPercentage: "VAT",
    status: "Status",
    note: "Notes",
    image: "Product Image",
    uploadHint: "JPG, PNG. Standard size is 1280x1280 px, for the 1:1 aspect ratio."
  },
  placeholder: {
    name: "Enter product name",
    code: "Enter product code",
    price: "Enter selling price",
    description: "Enter product description...",
    category: "Select category",
    categoryMock1: "Category 1",
    categoryMock2: "Category 2"
  },
  validation: {
    required: "{{field}} is required",
    number: "{{field}} must be a number",
    invalidCode: "Product code allows letters, digits and _ - ( ) , . (2–30 chars)",
    invalidName: "Product name must be 2–200 characters with no special symbols"
  },
  messages: {
    updateStatusSuccess: "Status updated successfully",
    updateStatusError: "Failed to update status",
    createSuccess: "Product created successfully",
    createError: "Failed to create product",
    updateSuccess: "Product updated successfully",
    updateError: "Failed to update product",
    deleteSuccess: "Product deleted successfully",
    deleteError: "Failed to delete product",
    deleteConfirm: "Are you sure you want to delete this product?",
    batchDeleteConfirm: "Are you sure you want to delete {{count}} selected products?"
  }
};
