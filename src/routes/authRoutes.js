/* const { Router } = require("express");
const authRoutes = Router();
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

authRoutes.post("/register", registerUser);

authRoutes.post("/login", loginUser);

authRoutes.post("/password/forgot", forgotPassword);

authRoutes.put("/password/reset/:token", resetPassword);

authRoutes.get("/logout", logout);

authRoutes.get("/me", isAuthenticatedUser, getUserDetails);

authRoutes.put("/password/update", isAuthenticatedUser, updatePassword);

authRoutes.put("/me/update", isAuthenticatedUser, updateProfile);

authRoutes.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUser
);

authRoutes.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSingleUser
);
authRoutes.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUserRole
);
authRoutes.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = authRoutes;
 */