import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

def preprocess_data(X, y):

    # Ensure X contains numeric values
    X = np.asarray(X, dtype=np.float32)  # Convert X to a NumPy array of type float
    
    # Normalize landmark coordinates
    X_normalized = X / np.max(np.abs(X), axis=0)  # Normalize each column independently

    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    y_one_hot = OneHotEncoder(sparse_output=False).fit_transform(y_encoded.reshape(-1, 1))

    return X_normalized, y_one_hot, label_encoder
