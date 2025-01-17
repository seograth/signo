import os
from src.data.dataset_loader import load_dataset
from src.data.preprocess import preprocess_data
from src.model.model import build_model
from src.model.train import train_model
from src.evaluation.evaluate import evaluate_model

if __name__ == "__main__":
    # Paths
    dataset_path = "data/processed/gsl_dataset.csv"
    model_save_path = "models/gsl_hand_model.h5"

    # Load and preprocess dataset
    X, y = load_dataset(dataset_path)
    X, y, label_encoder = preprocess_data(X, y)

    # Split dataset
    from sklearn.model_selection import train_test_split
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

    # Build and train model
    input_shape = (X.shape[1],)
    num_classes = y.shape[1]
    model = build_model(input_shape, num_classes)
    train_model(model, X_train, y_train, X_val, y_val, epochs=100, batch_size=32)

    # Save model
    model.save(model_save_path)

    # Evaluate model
    evaluate_model(model, X_test, y_test)
