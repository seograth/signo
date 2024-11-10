import express from "express";
import classifyGestureRouter from "./classify_gesture";

const app = express();

app.use("/gestures", classifyGestureRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}
