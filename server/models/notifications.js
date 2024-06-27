import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    text: {
      type: String,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    notiType: {
      type: String,
      default: "alert",
      enum: ["alert", "message"],
    },
    isRead: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notificationSchema);

export default Notifications;
