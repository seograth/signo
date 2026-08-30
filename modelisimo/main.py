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

    # 1. Load and preprocess raw dataset
    X, y = load_dataset(dataset_path)
    X_norm, y_onehot, label_encoder = preprocess_data(X, y)

    # 2. Split dataset BEFORE augmentation to prevent data leakage
    X_train, X_temp, y_train, y_temp = train_test_split(
        X_norm, y_onehot, test_size=0.30, shuffle=True, random_state=42
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, shuffle=True, random_state=42
    )

    # 3. Augment ONLY the training split
    X_train_aug, y_train_aug = augment_data(X_train, y_train)

    print("Training set shape (augmented):", X_train_aug.shape, y_train_aug.shape)
    print("Validation set shape:", X_val.shape, y_val.shape)
    print("Test set shape:", X_test.shape, y_test.shape)

    # 4. Verify no data leakage
    train_hashes = set(hash(x.tobytes()) for x in X_train_aug)
    val_overlap = sum(1 for x in X_val if hash(x.tobytes()) in train_hashes)
    test_overlap = sum(1 for x in X_test if hash(x.tobytes()) in train_hashes)
    print(f"Overlap check -> Validation in Train: {val_overlap}, Test in Train: {test_overlap}")

    # 5. Build and train model
    input_shape = (X_train_aug.shape[1],)
    num_classes = y_train_aug.shape[1]
    model = build_model(input_shape, num_classes)

    train_model(model, X_train_aug, y_train_aug, X_val, y_val, epochs=25, batch_size=32)

    # 6. Save model and label encoder
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    model.save(model_save_path)
    np.save(label_encoder_save_path, label_encoder.classes_)

    # 7. Evaluate model on pure unseen test set
    evaluate_model(model, X_test, y_test)
