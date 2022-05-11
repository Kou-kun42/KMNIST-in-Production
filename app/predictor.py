import numpy as np
import pandas as pd
import keras
from keras.preprocessing import image

# Defines class to load model and perform the prediction
class ImagePredictor:
    # Load pre-trained model
    def __init__(self):
        self.model = keras.models.load_model("model/kmnist_classifier.h5")

    # Takes in an image file, converts it to an array and gets prediction
    def predict(self, image_file):
        # Sets character mapping for classes
        character_map = pd.read_csv("model/k49_classmap.csv", encoding="utf-8")
        # Convert image data to an array
        img = image.img_to_array(image_file)
        img = np.expand_dims(img, axis=0)
        # Normalize the pixel values
        img /= 255
        # Invert the colors to what the model is trained on
        img = 1 - img

        # Send data and retrieve array of predictions
        pred = self.model.predict(img)

        # Find class with highest score and return the associated character
        return character_map.iloc[[pred.argmax()]]["char"].values[0]
