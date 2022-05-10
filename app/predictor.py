import numpy as np
import pandas as pd
from scipy import ndimage
import keras
from keras.preprocessing import image


class ImagePredictor:
    def __init__(self):
        self.model = keras.models.load_model("model/kmnist_classifier.h5")

    def predict(self, image_file):
        character_map = pd.read_csv("model/k49_classmap.csv", encoding="utf-8")
        img = image.img_to_array(image_file)
        img = np.expand_dims(img, axis=0)
        img /= 255
        img = 1 - img

        pred = self.model.predict(img)

        character_map.iloc[[pred.argmax()]]["char"].values[0]

        return character_map.iloc[[pred.argmax()]]["char"].values[0]
