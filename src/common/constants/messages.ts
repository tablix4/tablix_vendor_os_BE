export const Messages = {
  // =========================
  // AUTH
  // =========================
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
  LOGIN_SUCCESS: 'Login successful',
  PROFILE_COMPLETED: 'Profile completed successfully',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
  LOGOUT_SUCCESS: 'Logout successful',

  INVALID_OTP: 'Invalid OTP',
  OTP_EXPIRED: 'OTP has expired',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_EXPIRE_REFRESH_TOKEN: 'Invalid or expired refresh token',
  LOGIN_AGAIN: 'Please login again',

  // =========================
  // SHOP
  // =========================
  SHOP_NOT_FOUND: 'Shop not found',
  SHOP_FETCH_SUCCESS: 'Shop fetched successfully',
  SHOP_UPDATED: 'Shop updated successfully',

  // =========================
  // CATEGORY
  // =========================
  CATEGORY_ALREADY_EXISTS: 'Category already exists',
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_FETCH_SUCCESS: 'Categories fetched successfully',
  CATEGORY_DETAILS: 'Category details fetched successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  CATEGORY_NOT_FOUND: 'Category not found',

  // =========================
  // MENU
  // =========================
  MENU_ITEM_CREATED: 'Menu item created successfully',
  MENU_FETCH_SUCCESS: 'Menu items fetched successfully',
  MENU_DETAILS: 'Menu item details fetched successfully',
  MENU_UPDATED: 'Menu item updated successfully',
  MENU_DELETED: 'Menu item deleted successfully',
  MENU_AVAILABILITY_UPDATED: 'Menu availability updated successfully',
  MENU_ITEM_NOT_FOUND: 'Menu item not found',
  INVALID_CATEGORY: 'Invalid category',

  // =========================
  // ORDER
  // =========================
  ORDER_CREATED: 'Order created successfully',
  ORDER_FETCH_SUCCESS: 'Orders fetched successfully',
  ORDER_DETAILS: 'Order details fetched successfully',
  ORDER_UPDATED: 'Order status updated successfully',
  ORDER_NOT_FOUND: 'Order not found',
  INVALID_MENU_ITEM: 'Invalid menu item',
  INVALID_MENU_ITEMS: 'One or more menu items are invalid or unavailable.',

  // =========================
  // DASHBOARD
  // =========================
  DASHBOARD_FETCH_SUCCESS: 'Dashboard fetched successfully',

  // =========================
  // USER
  // =========================
  PROFILE_FETCH_SUCCESS: 'Profile fetched successfully',
  USER_NOT_FOUND: 'User not found',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;
