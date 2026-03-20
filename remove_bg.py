from PIL import Image
import numpy as np

def white_to_transparent(input_path, output_path, threshold=230):
    """
    Convierte el fondo blanco/casi blanco en transparente.
    threshold: píxeles con R,G,B > threshold se vuelven transparentes.
    """
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Máscara: píxeles muy claros (fondo blanco) → transparentes
    white_mask = (r > threshold) & (g > threshold) & (b > threshold)

    # Suavizar los bordes: calcular alpha basado en qué tan "blanco" es el píxel
    # Esto crea una transición suave en los bordes
    brightness = (r + g + b) / 3.0
    edge_alpha = np.clip((255 - brightness) / (255 - threshold) * 255, 0, 255)

    new_alpha = np.where(white_mask, edge_alpha, 255).astype(np.uint8)
    data[:,:,3] = new_alpha

    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    result.save(output_path, "PNG")
    print(f"✅ Guardado: {output_path}")

inputs = [
    ("producto_hero.jpg",   "producto_hero.png"),
    ("producto_ciencia.jpg","producto_ciencia.png"),
]

for inp, out in inputs:
    print(f"Procesando {inp}...")
    white_to_transparent(inp, out, threshold=230)

print("¡Listo!")
