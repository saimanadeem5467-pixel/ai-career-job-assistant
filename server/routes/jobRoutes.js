const express = require("express");

const router = express.Router();

router.get("/matches", async (req, res) => {
  try {
    console.log("Job matches request received");

    // Temporary response to test the connection.
    // We will replace this with the real jobs API next.
    res.json({
      success: true,
      jobs: [],
    });

  } catch (error) {
    console.error("Fetch Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

module.exports = router;