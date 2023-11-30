const { Router } = require("express");
const profileRoutes = Router();
const {
  profileUser,
  editProfile,
  deleteProfile,
} = require("../handlers/profileHandler");

profileRoutes.get("/:id", profileUser);

profileRoutes.put("/:id", editProfile);

profileRoutes.put("/:id", deleteProfile);

module.exports = profileRoutes;
