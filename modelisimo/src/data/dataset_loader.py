import pandas as pd

def load_dataset(csv_path):
    import pandas as pd
    data = pd.read_csv(csv_path)
    X = data.iloc[:, 1:].values  # Landmarks (features)
    y = data.iloc[:, 0].values   # Labels
    return X, y