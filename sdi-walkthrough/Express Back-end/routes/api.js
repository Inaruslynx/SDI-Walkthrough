const express = require("express");
const router = express.Router();
const passport = require("passport");

const { tryAsync } = require("../utils/tryAsync");
const api = require("../controllers/api");

router.route("/graph").get(tryAsync(api.getGraphData)).post(tryAsync(api.processGraphFetch));

router.route("/report").get(tryAsync(api.getReport));

router.route("/departments").get(tryAsync(api.getDepartments));

router.route("/admin/walkthrough").get(tryAsync(api.getWalkthroughs)).post(tryAsync(api.createNewWalkthrough));

module.exports = router;