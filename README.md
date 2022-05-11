# Kuzushiji MNIST Classifier

### Live Application Site

![Kuzushiji MNIST Classifier](https://github.com/Kou-kun42/Kuzushiji-MNIST-Classifier/blob/main/KuzushijiClassifier.png?raw=true)

[Live Deployment](https://kmnist.tuffy.dev/)

### Overview

Kuzushiji MNIST Classifier is a web based deployment of a deep learning convolutional neural network trained using the [KMNIST Dataset](https://github.com/rois-codh/kmnist).  KMNIST is similar to the popular [MNIST Dataset](http://yann.lecun.com/exdb/mnist/) except it contains images of handwritten Japanese Hiragana characters.  I am using the Kuzushiji-49 dataset which contains 270,912 images spanning 49 classes.  This project contains both the [development notebook](model/development.ipynb) detailing the creation of the CNN model, and the source code for the [Flask based web app](app/).

### CNN Model Outcome

The model I created achieved a final balanced accuracy of about **91.3%** over all of the classes.  I saved this model and am using it to create class predictions from a given input file in the web app.

### Web Application Process

The app uses the JavaScript Canvas API to capture mouse or touch input from a web browser and then streams the image data back to the Flask backend where it is resized and processed into a numpy array for consumption into the Tensorflow Keras predict method of the model.  The method returns an array of prediction scores, of which the greatest score is selected and matched with the character map to obtain the associated Hiragana character.

### Docker Deployment

For deployment, I created a Dockerfile to build the image and a docker-compose file to create the container.  The app is launched using Gunicorn and network connections are routed through the Traefik reverse proxy alongside the other services I have running on my personal server.

### Local Testing Deployment

If you would like to deploy this app locally, follow the following steps to set up your environment and launch the Flask development server:

To launch this app on your local environment, clone this repository:

```
git clone https://github.com/Kou-kun42/VideoGameInfo.git
```

Then, set up a python virtual environment using:

```
python3 -m venv env
```

and then activate it:

```
source env/bin/activate
```

Next, install all the required packages:

```
pip3 install -r requirements.txt
```

Finally, launch the app:

```
python3 app.py
```
