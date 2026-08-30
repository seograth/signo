import json
import os
import numpy as np
import tensorflow as tf

# Greek Alphabet mapping (1 -> Α, 2 -> Β, ..., 24 -> Ω)
GREEK_ALPHABET = [
    {"index": 1, "letter": "Α", "name": "Άλφα", "enName": "Alpha", "sound": "a"},
    {"index": 2, "letter": "Β", "name": "Βήτα", "enName": "Beta", "sound": "v"},
    {"index": 3, "letter": "Γ", "name": "Γάμμα", "enName": "Gamma", "sound": "gh"},
    {"index": 4, "letter": "Δ", "name": "Δέλτα", "enName": "Delta", "sound": "dh"},
    {"index": 5, "letter": "Ε", "name": "Έψιλον", "enName": "Epsilon", "sound": "e"},
    {"index": 6, "letter": "Ζ", "name": "Ζήτα", "enName": "Zeta", "sound": "z"},
    {"index": 7, "letter": "Η", "name": "Ήτα", "enName": "Eta", "sound": "i"},
    {"index": 8, "letter": "Θ", "name": "Θήτα", "enName": "Theta", "sound": "th"},
    {"index": 9, "letter": "Ι", "name": "Γιώτα", "enName": "Iota", "sound": "i"},
    {"index": 10, "letter": "Κ", "name": "Κάππα", "enName": "Kappa", "sound": "k"},
    {"index": 11, "letter": "Λ", "name": "Λάμδα", "enName": "Lambda", "sound": "l"},
    {"index": 12, "letter": "Μ", "name": "Μι", "enName": "Mu", "sound": "m"},
    {"index": 13, "letter": "Ν", "name": "Νι", "enName": "Nu", "sound": "n"},
    {"index": 14, "letter": "Ξ", "name": "Ξι", "enName": "Xi", "sound": "x"},
    {"index": 15, "letter": "Ο", "name": "Όμικρον", "enName": "Omicron", "sound": "o"},
    {"index": 16, "letter": "Π", "name": "Πι", "enName": "Pi", "sound": "p"},
    {"index": 17, "letter": "Ρ", "name": "Ρο", "enName": "Rho", "sound": "r"},
    {"index": 18, "letter": "Σ", "name": "Σίγμα", "enName": "Sigma", "sound": "s"},
    {"index": 19, "letter": "Τ", "name": "Ταύ", "enName": "Tau", "sound": "t"},
    {"index": 20, "letter": "Υ", "name": "Ύψιλον", "enName": "Upsilon", "sound": "y"},
    {"index": 21, "letter": "Φ", "name": "Φι", "enName": "Phi", "sound": "f"},
    {"index": 22, "letter": "Χ", "name": "Χι", "enName": "Chi", "sound": "ch"},
    {"index": 23, "letter": "Ψ", "name": "Ψι", "enName": "Psi", "sound": "ps"},
    {"index": 24, "letter": "Ω", "name": "Ωμέγα", "enName": "Omega", "sound": "o"},
]

def export_model_to_json(model_path, label_encoder_path, output_json_path):
    print(f"Loading model from {model_path}...")
    model = tf.keras.models.load_model(model_path)
    
    classes = np.load(label_encoder_path).tolist() if os.path.exists(label_encoder_path) else list(range(1, 25))
    print(f"Loaded {len(classes)} classes: {classes}")
    
    layers_data = []
    
    for layer in model.layers:
        layer_type = layer.__class__.__name__
        layer_info = {"type": layer_type, "name": layer.name}
        
        weights = layer.get_weights()
        if layer_type == "Dense":
            # W is shape (in_features, out_features), b is shape (out_features,)
            W = weights[0].tolist()
            b = weights[1].tolist()
            layer_info["weights"] = W
            layer_info["biases"] = b
            layer_info["activation"] = layer.get_config().get("activation", "linear")
        elif layer_type == "BatchNormalization":
            # gamma, beta, moving_mean, moving_variance
            gamma = weights[0].tolist()
            beta = weights[1].tolist()
            moving_mean = weights[2].tolist()
            moving_variance = weights[3].tolist()
            epsilon = layer.epsilon
            layer_info["gamma"] = gamma
            layer_info["beta"] = beta
            layer_info["mean"] = moving_mean
            layer_info["variance"] = moving_variance
            layer_info["epsilon"] = epsilon
        elif layer_type == "Activation":
            layer_info["activation"] = layer.get_config().get("activation", "relu")
        elif layer_type == "Dropout":
            continue  # Not needed during inference
            
        layers_data.append(layer_info)
        
    export_payload = {
        "model_name": "GSL_Hand_Pose_Classifier",
        "input_features": 63,
        "classes": classes,
        "alphabet": GREEK_ALPHABET,
        "layers": layers_data
    }
    
    os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(export_payload, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully exported model to {output_json_path} ({os.path.getsize(output_json_path) // 1024} KB)")

if __name__ == "__main__":
    model_path = "./modelisimo/models/gsl_hand_model.h5"
    if not os.path.exists(model_path):
        model_path = "./best_model.h5"
    label_encoder_path = "./modelisimo/models/label_encoder_classes.npy"
    output_json_path = "./src/assets/gsl_model.json"
    
    export_model_to_json(model_path, label_encoder_path, output_json_path)
