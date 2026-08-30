import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

def normalize_hand_landmarks(landmarks):
    """
    Normalizes 21 3D hand landmarks (63 values) to be translation and scale invariant:
    1. Origin centered at the wrist (landmark 0).
    2. Scale normalized by the distance between wrist (0) and middle finger MCP (9).
    """
    pts = np.array(landmarks, dtype=np.float32).reshape(-1, 3)
    wrist = pts[0, :].copy()
    pts_centered = pts - wrist
    
    # Scale reference: distance between wrist (0) and middle MCP (9)
    scale = np.linalg.norm(pts_centered[9])
    if scale > 1e-6:
        pts_normalized = pts_centered / scale
    else:
        max_dist = np.max(np.linalg.norm(pts_centered, axis=1))
        pts_normalized = pts_centered / (max_dist if max_dist > 1e-6 else 1.0)
        
    return pts_normalized.flatten()

def preprocess_data(X, y):
    """
    Preprocess the dataset by normalizing X using coordinate-relative scaling and encoding y.
    """
    X = np.asarray(X, dtype=np.float32)
    X_normalized = np.zeros_like(X)
    for i in range(len(X)):
        X_normalized[i] = normalize_hand_landmarks(X[i])

    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    y_one_hot = OneHotEncoder(sparse_output=False).fit_transform(y_encoded.reshape(-1, 1))

    return X_normalized, y_one_hot, label_encoder

def augment_data(X, y=None):
    """
    Augment the dataset by adding subtle jitter noise and slight rotational variance.
    Only applied to training partition to avoid data leakage.
    """
    noise = np.random.normal(0, 0.015, X.shape)
    X_noisy = X + noise

    # Combine original and jittered data
    X_augmented = np.vstack((X, X_noisy))
    
    if y is not None:
        y_augmented = np.vstack((y, y))
        return X_augmented, y_augmented
        
    return X_augmented