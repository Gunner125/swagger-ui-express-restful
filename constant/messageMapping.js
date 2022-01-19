module.exports.customer = {
      register_success: { status: 201, message: "Customer Registered" },
      upload_success: { status: 201, message: "Upload Completed" },
      
      duplicate_customer: { status: 409, message: "This username is already in use" },
      no_image_found: { status: 503, message: "Image not found, Upload again." },
};