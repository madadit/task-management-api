const express = require("express");
const router = express.Router();
const db = require("../database");
const auth = require("../middleware/auth");

router.use(auth);

/**
 * GET /tasks (Pagination)
 */
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT * FROM tasks
     WHERE deleted_at IS NULL
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      db.get(
        `SELECT COUNT(*) as total FROM tasks WHERE deleted_at IS NULL`,
        [],
        (err, count) => {
          res.status(200).json({
            responseCode: "200",
            message: "Success get task list",
            data: rows,
            pagination: {
              page,
              limit,
              total: count.total,
            },
          });
        }
      );
    }
  );
});

/**
 * GET /tasks/:id
 */
router.get("/:id", (req, res) => {
  db.get(
    `SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL`,
    [req.params.id],
    (err, row) => {
      if (!row) {
        return res.status(404).json({
          responseCode: "404",
          message: "Task not found",
        });
      }

      res.status(200).json({
        responseCode: "200",
        message: "Success get task detail",
        data: row,
      });
    }
  );
});

/**
 * POST /tasks
 */
router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({
      responseCode: "400",
      message: "Title is required",
    });
  }

  if (status && !["pending", "done"].includes(status)) {
    return res.status(400).json({
      responseCode: "400",
      message: "Status must be pending or done",
    });
  }

  db.run(
    `INSERT INTO tasks (title, description, status, user_id)
     VALUES (?, ?, ?, ?)`,
    [title, description, status || "pending", 1],
    function () {
      db.get(
        `SELECT * FROM tasks WHERE id = ?`,
        [this.lastID],
        (err, task) => {
          res.status(201).json({
            responseCode: "201",
            message: "Task created successfully",
            data: task,
          });
        }
      );
    }
  );
});

/**
 * PUT /tasks/:id
 */
router.put("/:id", (req, res) => {
  const fields = [];
  const values = [];

  Object.entries(req.body).forEach(([key, value]) => {
    if (["title", "description", "status"].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return res.status(400).json({
      responseCode: "400",
      message: "No valid fields to update",
    });
  }

  db.run(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ? AND deleted_at IS NULL`,
    [...values, req.params.id],
    function () {
      if (this.changes === 0) {
        return res.status(404).json({
          responseCode: "404",
          message: "Task not found",
        });
      }

      db.get(
        `SELECT * FROM tasks WHERE id = ?`,
        [req.params.id],
        (err, task) => {
          res.status(200).json({
            responseCode: "200",
            message: "Task updated successfully",
            data: task,
          });
        }
      );
    }
  );
});

/**
 * DELETE /tasks/:id (Soft Delete)
 */
router.delete("/:id", (req, res) => {
  db.run(
    `UPDATE tasks
     SET deleted_at = datetime('now')
     WHERE id = ? AND deleted_at IS NULL`,
    [req.params.id],
    function () {
      if (this.changes === 0) {
        return res.status(404).json({
          responseCode: "404",
          message: "Task not found",
        });
      }

      res.status(200).json({
        responseCode: "200",
        message: "Task deleted successfully",
      });
    }
  );
});

module.exports = router;
