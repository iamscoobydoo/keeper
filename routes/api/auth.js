require("dotenv").config({ path: "../.env" });
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");