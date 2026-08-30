import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from src.data.preprocess import normalize_hand_landmarks

GREEK_LETTERS = [
    "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ",
    "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"
]

def live_prediction(model_path, label_encoder_path=None):
    """
    Real-time prediction using the trained model and MediaPipe Hands with standardized landmark normalization.
    """
    print("Loading model...")
    model = tf.keras.models.load_model(model_path)
    
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )
    mp_draw = mp.solutions.drawing_utils

    cap = cv2.VideoCapture(0)
    print("Webcam started. Press 'q' to quit.")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = hands.process(rgb_frame)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                raw_landmarks = np.array([[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark]).flatten()

                # Normalize using wrist-centered scale-invariant function
                normalized = normalize_hand_landmarks(raw_landmarks)
                input_tensor = np.expand_dims(normalized, axis=0)

                # Inference
                prediction = model.predict(input_tensor, verbose=0)[0]
                pred_idx = np.argmax(prediction)
                confidence = prediction[pred_idx] * 100
                
                letter = GREEK_LETTERS[pred_idx] if pred_idx < len(GREEK_LETTERS) else str(pred_idx + 1)

                # Overlay prediction
                text = f"Sign: {letter} ({confidence:.1f}%)"
                color = (0, 255, 0) if confidence > 70 else (0, 165, 255)
                cv2.putText(frame, text, (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)

                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        cv2.imshow("SigniFi - Greek Sign Language Live Inference", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    model_path = "./modelisimo/models/gsl_hand_model.h5"
    live_prediction(model_path)
