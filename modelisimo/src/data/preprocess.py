import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

def preprocess_data(X, y):
    """
    Preprocess the dataset by normalizing X and encoding y.

    Parameters:
        X: np.ndarray
            Array of hand landmarks (features).
        y: list or np.ndarray
            List of labels corresponding to the gestures.

    Returns:
        X_normalized: np.ndarray
            Normalized landmarks.
        y_one_hot: np.ndarray
            One-hot encoded labels.
        label_encoder: LabelEncoder
            Encoder for transforming labels.
    """
    # Ensure X contains numeric values
    X = np.asarray(X, dtype=np.float32)  # Convert X to a NumPy array of type float
    
    # Normalize landmark coordinates
    X_normalized = X / np.max(np.abs(X), axis=0)  # Normalize each column independently

    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    y_one_hot = OneHotEncoder(sparse_output=False).fit_transform(y_encoded.reshape(-1, 1))

    return X_normalized, y_one_hot, label_encoder

def augment_data(X):
    """
    Augment the dataset by adding noise and flipping landmarks.

    Parameters:
        X: np.ndarray
            Array of hand landmarks.

    Returns:
        X_augmented: np.ndarray
            Augmented dataset.
    """
    # Add small random noise to the landmarks
    noise = np.random.normal(0, 0.01, X.shape)
    X_noisy = X + noise

    # Flip landmarks horizontally (assuming normalized X in range [0, 1])
    X_flipped = X.copy()
    X_flipped[:, ::3] = 1 - X_flipped[:, ::3]  # Flip x-coordinates

    # Combine original, noisy, and flipped data
    X_augmented = np.vstack((X, X_noisy, X_flipped))
    return X_augmented