import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import os

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# Dataset directory and output file
dataset_dir = "data/raw/"
os.makedirs(dataset_dir, exist_ok=True)
output_file = "data/processed/gsl_dataset.csv"

# Function to collect data
def collect_data(label, num_samples=100):
    print(f"Starting data collection for gesture: {label}")
    cap = cv2.VideoCapture(0)

    # Initialize counters
    sample_count = 0
    landmarks_data = []

    while cap.isOpened() and sample_count < num_samples:
        ret, frame = cap.read()
        if not ret:
            break

        # Flip and convert the frame
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process with MediaPipe Hands
        results = hands.process(rgb_frame)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Extract landmarks
                landmarks = []
                for lm in hand_landmarks.landmark:
                    landmarks.extend([lm.x, lm.y, lm.z])  # Append x, y, z coordinates

                # Append label and save the sample
                landmarks.append(label)
                landmarks_data.append(landmarks)

                # Visualize landmarks on the frame
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Update sample count
                sample_count += 1
                print(f"Collected sample {sample_count}/{num_samples}", end="\r")

        # Display the frame
        cv2.imshow("Collecting Data", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):  # Quit on 'q'
            break

    cap.release()
    cv2.destroyAllWindows()
    print(f"\nFinished collecting data for gesture: {label}")
    return landmarks_data

# Save data to CSV
def save_to_csv(data, output_file):
    print(f"Saving data to {output_file}")
    columns = [f"x{i}" for i in range(21)] + [f"y{i}" for i in range(21)] + [f"z{i}" for i in range(21)] + ["label"]
    df = pd.DataFrame(data, columns=columns)
    df.to_csv(output_file, index=False)
    print(f"Dataset saved successfully!")

# Main function to collect dataset
if __name__ == "__main__":
    all_data = []

    # Prompt user for gestures and collect data
    while True:
        gesture_label = input("Enter the gesture label (or type 'done' to finish): ").strip()
        if gesture_label.lower() == "done":
            break
        num_samples = int(input(f"How many samples to collect for {gesture_label}? "))
        data = collect_data(gesture_label, num_samples)
        all_data.extend(data)

    # Save all data to a CSV file
    save_to_csv(all_data, output_file)
