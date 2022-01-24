module.exports.auth = {
      login_success: { status: 200, message: "Login Success." },
      logout_success: { status: 200, message: "Logout Success." },

      token_not_found: { status: 401, message: "Unauthorized" },
      refresh_token_exprire: { status: 400, message: "Refresh Token Expried." },
      invalid_password: { status: 401, message: "Invalid password." },
};

module.exports.customer = {
      register_success: { status: 201, message: "Customer Registered." },
      upload_success: { status: 201, message: "Upload Completed." },
      get_data_success: { status: 200, message: "Get Success." },
      point_convert_success: { status: 200, message: "Point convert Success." },

      invalid_password: { status: 401, message: "Invalid password." },
      user_not_found: { status: 404, message: "User Not found." },
      duplicate_customer: { status: 409, message: "This username is already in use." },
      no_image_found: { status: 503, message: "Image not found, Upload again." },
      product_id_validate_fail: { status: 422, message: "Invalid product ID." },
      convert_point_not_enough: { status: 422, message: "Point not enough." },
};


module.exports.user = {
      duplicate_user: { status: 409, message: "This username is already in use" },
      user_not_found: { status: 404, message: "User Not found." },
      invalid_password: { status: 401, message: "Invalid password." },

      register_success: { status: 201, message: "User Registered." },
      product_validate_fail: { status: 422, message: "Product name can't empty and point must greater than or equal 0." },
      product_created: { status: 201, message: "Product Created." },

      slip_data_validate_fail: { status: 422, message: "Invalid slip ID or point must greater than 0." },
      slip_id_validate_fail: { status: 422, message: "Invalid slip ID." },
      slip_point_gived: { status: 200, message: "Point given success." }
};