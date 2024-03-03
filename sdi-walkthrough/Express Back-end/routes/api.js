const express = require("express");
const router = express.Router();
const passport = require("passport");

const { tryAsync } = require("../utils/tryAsync");
const api = require("../controllers/api");

router.route("/graph").get(tryAsync(api.getGraphData)).post(tryAsync(api.processGraphFetch));

router.route("/report").get(tryAsync(api.getReport));

router.route("/departments").get(tryAsync(api.getDepartments));

module.exports = router;