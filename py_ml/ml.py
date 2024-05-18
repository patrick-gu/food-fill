import torch
import pickle
from transformers import pipeline
import numpy
import torchvision


def debug_print(str):
    print(f"[DEBUG] {str}")

# with open('py_ml/pytorch_model.bin', 'rb') as f:
#     model = pickle.load(f)

# model = torch.load('py_ml/pytorch_model.bin', map_location=torch.device('cpu'))

# print(model.keys())
# image = torchvision.io.read_image('public/apple.jpg')
# debug_print(type(image))
# debug_print(image.shape)

# image_np = image.numpy()
# image_np = numpy.transpose(image_np, (1, 2, 0))
pipe = pipeline("image-classification", model="nateraw/food")
result = pipe('public/fries.jpg')
debug_print(result)
