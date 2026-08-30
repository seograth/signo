import os
import sys
import json
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Add modelisimo to path
sys.path.insert(0, './modelisimo')
from src.data.dataset_loader import load_dataset
from src.data.preprocess import normalize_hand_landmarks, augment_data
from src.model.export_model import GREEK_ALPHABET

def main():
    print("=== Training SigniFi GSL Model with Standardized Wrist Normalization ===")
    dataset_path = "./modelisimo/data/processed/gsl_dataset.csv"
    model_save_path = "./modelisimo/models/gsl_hand_model.h5"
    best_model_root = "./best_model.h5"
    export_json_path = "./src/assets/gsl_model.json"
    
    # 1. Load Dataset
    X, y = load_dataset(dataset_path)
    print(f"Loaded {len(X)} samples across {len(np.unique(y))} classes.")
    
    # 2. Normalize using wrist-centered scale-invariant function
    X_norm = np.array([normalize_hand_landmarks(row) for row in X], dtype=np.float32)
    y_cat = tf.keras.utils.to_categorical(y - 1, num_classes=24)
    
    # 3. Train/Validation/Test Split (Stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X_norm, y_cat, test_size=0.2, random_state=42, stratify=y_cat
    )
    
    # 4. Augment training set with subtle jitter
    X_train_aug, y_train_aug = augment_data(X_train, y_train)
    print(f"Training samples (augmented): {len(X_train_aug)}, Test samples: {len(X_test)}")
    
    # 5. Build Model
    inputs = tf.keras.Input(shape=(63,))
    x = tf.keras.layers.Dense(128)(inputs)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Activation('relu')(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    
    x = tf.keras.layers.Dense(128)(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Activation('relu')(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    
    x = tf.keras.layers.Dense(64)(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Activation('relu')(x)
    
    outputs = tf.keras.layers.Dense(24, activation='softmax')(x)
    
    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=12, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-5)
    ]
    
    model.fit(
        X_train_aug, y_train_aug,
        validation_split=0.15,
        epochs=35,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )
    
    # 6. Evaluate
    preds = np.argmax(model.predict(X_test), axis=1)
    y_true = np.argmax(y_test, axis=1)
    acc = np.mean(preds == y_true)
    print(f"\n======================================")
    print(f"Final Test Accuracy: {acc * 100:.2f}%")
    print(f"======================================")
    print(classification_report(y_true, preds))
    
    # 7. Save Keras Models
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    model.save(model_save_path)
    model.save(best_model_root)
    np.save("./modelisimo/models/label_encoder_classes.npy", np.arange(1, 25))
    print(f"Saved models to {model_save_path} and {best_model_root}")
    
    # 8. Export to Web JSON Format
    layers_data = []
    for layer in model.layers:
        layer_type = layer.__class__.__name__
        if layer_type in ["InputLayer", "Dropout"]:
            continue
        
        layer_info = {"type": layer_type, "name": layer.name}
        weights = layer.get_weights()
        
        if layer_type == "Dense":
            layer_info["weights"] = weights[0].tolist()
            layer_info["biases"] = weights[1].tolist()
            layer_info["activation"] = layer.get_config().get("activation", "linear")
        elif layer_type == "BatchNormalization":
            layer_info["gamma"] = weights[0].tolist()
            layer_info["beta"] = weights[1].tolist()
            layer_info["mean"] = weights[2].tolist()
            layer_info["variance"] = weights[3].tolist()
            layer_info["epsilon"] = layer.epsilon
        elif layer_type == "Activation":
            layer_info["activation"] = layer.get_config().get("activation", "relu")
            
        layers_data.append(layer_info)
        
    export_payload = {
        "model_name": "GSL_Hand_Pose_Classifier_V2",
        "input_features": 63,
        "classes": list(range(1, 25)),
        "alphabet": GREEK_ALPHABET,
        "layers": layers_data
    }
    
    with open(export_json_path, "w", encoding="utf-8") as f:
        json.dump(export_payload, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully exported updated model to {export_json_path}!")

if __name__ == "__main__":
    main()
