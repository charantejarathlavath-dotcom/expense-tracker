/**
 * JSON-file database via lowdb.
 *
 * This keeps the app dependency-light (no native bindings, no external DB
 * to install) while still persisting data across restarts — a reasonable
 * fit for local dev, demos, and small single-instance deployments.
 *
 * To scale beyond a single server instance or a few thousand records,
 * swap this module for Postgres (e.g. via Prisma or Knex) while keeping
 * the same exported shape (`db.get('expenses')...`) so the routes don't
 * need to change.
 */

const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const file = path.join(__dirname, "data", "db.json");
const adapter = new FileSync(file);
const db = low(adapter);

db.defaults({
  users: [],
  categories: [],
  expenses: [],
  budgets: [],
}).write();

module.exports = db;
