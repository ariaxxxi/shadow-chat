from auth_token import auth_token
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from io import BytesIO
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, revision = "fp16", torch_dtype=torch.float16, torch_auth_token=auth_token)
pipe.to("cuda")

@app.get("/")
def generate(prompt: str):
    with autocast("cuda"):
        image = pipe(prompt, guidance_scale=8.5).images[0]

    image.save("image.png")


    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(imgstr, media_type="image/png")