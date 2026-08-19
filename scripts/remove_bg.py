from PIL import Image
import sys

def is_near_black(r, g, b, thresh=60):
    return r < thresh and g < thresh and b < thresh

def remove_black_background(in_path, out_path):
    img = Image.open(in_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        if is_near_black(r, g, b):
            newData.append((255, 255, 255, 0))
        else:
            newData.append((r, g, b, a))

    img.putdata(newData)
    img.save(out_path, "PNG")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py input_path output_path")
        sys.exit(1)
    remove_black_background(sys.argv[1], sys.argv[2])
