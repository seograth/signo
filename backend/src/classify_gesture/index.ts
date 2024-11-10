import { Router } from "express";
import * as tf from "@tensorflow/tfjs-node";
import { ClassifyGestureResponse } from "./contracts";

const router = Router();

const handLandmarkArray = [
  [0.5, 0.6, -0.1],
  [0.52, 0.58, -0.1],
  [0.55, 0.55, -0.1],
  [0.58, 0.53, -0.1],
  [0.60, 0.50, -0.1],
  [0.62, 0.48, -0.1],
  [0.63, 0.47, -0.1],
  [0.64, 0.46, -0.1],
  [0.65, 0.45, -0.1],
  [0.67, 0.44, -0.1],
  [0.68, 0.42, -0.1],
  [0.69, 0.41, -0.1],
  [0.70, 0.40, -0.1],
  [0.72, 0.39, -0.1],
  [0.74, 0.38, -0.1],
  [0.75, 0.37, -0.1],
  [0.76, 0.36, -0.1],
  [0.77, 0.35, -0.1],
  [0.78, 0.34, -0.1],
  [0.79, 0.33, -0.1],
  [0.80, 0.32, -0.1]
];

router.post("/", async (req, res) => {
  const model = await tf.loadLayersModel("file://./src/classify_gesture/model/model.json");
  const result = model.predict(
    tf.tensor2d(handLandmarkArray)
  ) as tf.Tensor;

  res.json(new ClassifyGestureResponse(result.dataSync().toString()));
});

export default router;


/* 
actual code:

import { Router, Response } from "express";
import * as tf from "@tensorflow/tfjs-node";
import { ClassifyGestureRequest, ClassifyGestureResponse } from "./contracts";
import { TypedRequestBody } from "..";

const router = Router();

router.post("/", async (req: TypedRequestBody<ClassifyGestureRequest>, res: Response<ClassifyGestureResponse>) => {
  const model = await tf.loadLayersModel("file://./src/classify_gesture/model/model.json");
  const result = model.predict(
    tf.tensor2d(req.body.hands[0].landmarks.map(landmark => [landmark.x, landmark.y, landmark.z]))
  ) as tf.Tensor;

  res.json(new ClassifyGestureResponse(result.dataSync().toString()));
});

export default router;
*/
