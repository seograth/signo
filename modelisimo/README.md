Key Components

data/ Folder
    Raw Data: Store the original CSV or video files here.
    Processed Data: Save normalized and split datasets after preprocessing for reuse.

models/ Folder
    Save the trained model files (.h5 format) for deployment.
    Include versioning (e.g., v1.0_gsl_model.h5) for easier tracking of improvements.

src/ Folder
    Organize the code logically:
        data/ for dataset loading and preprocessing:
            dataset_loader.py: Loads the dataset from a CSV file.
            preprocess.py: Handles normalization, splitting, and label encoding.
        model/ for model creation and training:
            model.py: Defines the neural network architecture.
            train.py: Contains the training loop.
        evaluation/ for model evaluation:
            evaluate.py: Code for testing the model and generating metrics.
        inference/ for real-time gesture prediction:
            live_predict.py: Code for loading the model and performing live predictions using MediaPipe Hands.

tests/ Folder
    Write unit tests to ensure every component (data loading, model training, etc.) works as expected.
    Example: Test if the model can correctly predict known gestures.

requirements.txt
    List all Python dependencies (e.g., TensorFlow, NumPy, MediaPipe, etc.).

README.md

    Document the purpose of the project, setup instructions, and how to use it.

main.py

    The main entry point to execute the application. It might include:
        Training the model.
        Running evaluation.
        Launching the real-time prediction.