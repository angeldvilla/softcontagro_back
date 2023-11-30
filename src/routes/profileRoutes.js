const { Router } = require("express");
const profileRoutes = Router();
const {
  profileUser,
  editProfile,
  deleteProfile,
} = require("../handlers/profileHandler");

profileRoutes.get("/", profileUser);

profileRoutes.put("/edit", editProfile);

profileRoutes.put("/delete", deleteProfile);

module.exports = profileRoutes;
