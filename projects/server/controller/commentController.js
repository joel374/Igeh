const db = require("../models");

const commentController = {
  create: async (req, res) => {
    try {
      const { comment } = req.body;
      const { PostId } = req.params;

      const response = await db.Comment.create({
        comment,
        PostId,
        UserId: req.user.id,
      });
      return res.status(200).json({
        message: "Comment Created",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const { comment } = req.body;
      const { id } = req.params;

      const findComment = await db.Comment.findOne({
        where: {
          id,
        },
      });

      if (!findComment) {
        return res.status(400).json({
          message: "Comment not found",
        });
      }

      if (findComment.UserId != req.user.id) {
        return res.status(400).json({
          message: "User not authorized",
        });
      }

      await db.Comment.update(
        {
          comment,
        },
        {
          where: {
            id,
            UserId: req.user.id,
          },
        }
      );

      return res.status(200).json({
        message: "Comment Updated",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
};

module.exports = commentController;
