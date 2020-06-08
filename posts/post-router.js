const express = require("express");

// database access using knex
const knex = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  /**
   * GET a list of all the posts in "posts" table
   */
  knex
    .select()
    .from("posts")
    .then((posts) => {
      res.status(200).json({ data: posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get("/:id", (req, res) => {
  knex
    .select()
    .from("posts")
    .where({ id: req.params.id })
    .first()
    .then((post) => {
      res.status(200).json({ data: post });
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
});

const validatePost = (req, res, next) => {
  if (!req.body.title && !req.body.contents)
    res.status(400).json({ message: "No post content provided" });
  else if (!req.body.title || !req.body.contents) {
    if (req.params.id) next();
    else res.status(400).json({ message: "Title and contents are required" });
  } else next();
};
router.post("/", validatePost, (req, res) => {
  knex("posts")
    .insert(req.body, "id")
    .then(([id]) => {
      res.status(201).json({ data: { id } });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", validatePost, (req, res) => {
  const { id } = req.params;
  knex("posts")
    .where({ id })
    .update(req.body, "id")
    .then((count) => {
      if (count > 0) res.status(204).end();
      else res.status(404).json({ message: "Post not found" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  knex("posts")
    .where({ id })
    .del()
    .then((count) => {
      if (count > 0) res.status(204).end();
      else res.status(404).json({ message: "Post not found" });
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
});

module.exports = router;
