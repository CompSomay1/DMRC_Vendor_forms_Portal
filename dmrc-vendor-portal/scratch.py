from PIL import Image
import sys

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # Loop through pixels
    for item in datas:
        # If the pixel is mostly white, make it transparent
        # DMRC logo usually has a white background. Tolerance of 220.
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_white_bg(r"d:\DMRC WEB INTERN\DMRC WEB PROJECT\DMRC LOGO.jpg", r"d:\DMRC WEB INTERN\DMRC WEB PROJECT\dmrc-vendor-portal\public\dmrc-logo.png")
