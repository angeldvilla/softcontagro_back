const { Router } = require("express");
const authRoutes = Router();
const { authUser } = require("../handlers/autHandler");

authRoutes.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authUser(username, password);

    if (result.code === 200) {
      return res.status(result?.code).json({
        code: result?.code,
        message: result?.message,
        data: result?.data,
      });
    }
  } catch (error) {
    return res.status(500).json({
        code: 500,
        message: error.message,
    })
  }
});

module.exports = authRoutes;
