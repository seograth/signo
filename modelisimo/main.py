import os
import numpy as np
from src.data.dataset_loader import load_dataset
from src.data.preprocess import preprocess_data, augment_data
from src.model.model import build_model
from src.model.train import train_model
from src.evaluation.evaluate import evaluate_model
from sklearn.model_selection import train_test_split

if __name__ == "__main__":
    # Paths
    dataset_path = "./modelisimo/data/processed/gsl_dataset.csv"
    model_save_path = "./modelisimo/models/gsl_hand_model.h5"
    label_encoder_save_path = "./modelisimo/models/label_encoder_classes.npy"

    # Load and preprocess dataset
    X, y = load_dataset(dataset_path)
    X, y, label_encoder = preprocess_data(X, y)

    # Augment the dataset
    X_augmented = augment_data(X)
    y_augmented = np.tile(y, (3, 1))  # Repeat labels to match augmented data size

    # Split dataset
    X_train, X_temp, y_train, y_temp = train_test_split(X_augmented, y_augmented, test_size=0.2, shuffle=True, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.33, shuffle=True, random_state=42)

    # Build and train model
    input_shape = (X_train.shape[1],)
    num_classes = y_train.shape[1]
    model = build_model(input_shape, num_classes)

    train_model(model, X_train, y_train, X_val, y_val, epochs=5, batch_size=16)

    # Save model
    model.save(model_save_path)
    np.save(label_encoder_save_path, label_encoder.classes_)

    # Evaluate model
    evaluate_model(model, X_test, y_test)
