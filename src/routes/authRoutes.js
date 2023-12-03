const { Router } = require("express");
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
  getAllUsers,
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
  authorizeRoles("Administrador"),
  getAllUsers
);

authRoutes.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Administrador"),
  getSingleUser
);
authRoutes.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Administrador"),
  updateUserRole
);
authRoutes.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("Administrador"),
  deleteUser
);

module.exports = authRoutes;
