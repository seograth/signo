import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import joblib

def live_prediction(model_path, label_encoder):
    """
    Real-time prediction using the trained model and MediaPipe Hands.
    """
    # Load the trained model
    model = tf.keras.models.load_model(model_path)
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)
    mp_draw = mp.solutions.drawing_utils

    # Open the webcam
    cap = cv2.VideoCapture(0)
    print("Press 'q' to quit the live prediction.")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect hand landmarks
        results = hands.process(rgb_frame)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Extract landmarks
                landmarks = np.array([[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark]).flatten()

                # Normalize landmarks (ensure same preprocessing as training)
                landmarks = landmarks / np.max(landmarks)
                landmarks = np.expand_dims(landmarks, axis=0)

                # Predict gesture
                prediction = model.predict(landmarks)
                predicted_label = label_encoder.inverse_transform([np.argmax(prediction)])[0]

                # Display prediction on the frame
                cv2.putText(frame, f"Prediction: {predicted_label}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

                # Draw landmarks on the frame
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        cv2.imshow("Live Prediction", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Example usage
if __name__ == "__main__":
    from sklearn.preprocessing import LabelEncoder
    encoder = LabelEncoder()
    encoder.fit(["1", "2", "3", "4"])

    # Load the label encoder
    joblib.dump(encoder, "./modelisimo/models/label_encoder_classes.npy")
    # label_encoder = joblib.load("./modelisimo/models/label_encoder_classes.npy")  # Ensure you save the label encoder during preprocessing
    model_path = "./modelisimo/models/gsl_hand_model.h5"

    live_prediction(model_path, encoder)
