import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
    blog_author: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    children: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "users",
    },
    isReply: {
      type: Boolean,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

export default mongoose.model("comments", commentSchema);
