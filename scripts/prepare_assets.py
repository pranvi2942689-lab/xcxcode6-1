from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "assets" / "source"
OUTPUT_DIR = ROOT / "assets"


def expand_bbox(bbox, image_size, padding):
    left, top, right, bottom = bbox
    width, height = image_size
    return (
        max(0, left - padding),
        max(0, top - padding),
        min(width, right + padding),
        min(height, bottom + padding),
    )


def create_mask(image):
    width, height = image.size
    mask = Image.new("L", image.size, 0)
    source = image.load()
    target = mask.load()

    for y in range(height):
        for x in range(width):
            r, g, b, _ = source[x, y]
            max_channel = max(r, g, b)
            min_channel = min(r, g, b)
            span = max_channel - min_channel
            warm = max(r - b, 0) + max(g - b, 0)
            value = (r * 30 + g * 59 + b * 11) / 100
            keep = False

            if span >= 10 and warm >= 16 and value >= 24:
                keep = True
            elif span >= 7 and warm >= 20 and value >= 44:
                keep = True
            elif span >= 18 and r >= 112 and g >= 90:
                keep = True

            if keep:
                alpha = max(160, min(255, 120 + span * 5 + warm * 2))
                target[x, y] = alpha

    mask = mask.filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(0.8))
    return mask


def resize_to_max(image, max_edge):
    if not max_edge:
        return image

    width, height = image.size
    longest = max(width, height)
    if longest <= max_edge:
        return image

    scale = max_edge / longest
    target_size = (max(1, int(width * scale)), max(1, int(height * scale)))
    return image.resize(target_size, Image.LANCZOS)


def extract_subject(source_name, output_name, padding, max_edge=None):
    image = Image.open(SOURCE_DIR / source_name).convert("RGBA")
    mask = create_mask(image)
    image.putalpha(mask)
    bbox = image.getbbox()
    if not bbox:
        raise RuntimeError(f"Could not isolate subject for {source_name}")
    cropped = image.crop(expand_bbox(bbox, image.size, padding))
    cropped = resize_to_max(cropped, max_edge)
    cropped.save(OUTPUT_DIR / output_name, optimize=True)


def draw_tab_icon(name, color, kind):
    size = 96
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    stroke = 6

    if kind == "home":
        draw.polygon([(18, 42), (48, 18), (78, 42)], outline=color, width=stroke)
        draw.rounded_rectangle((26, 40, 70, 76), radius=10, outline=color, width=stroke)
    elif kind == "course":
        draw.rounded_rectangle((18, 22, 78, 78), radius=12, outline=color, width=stroke)
        draw.line((18, 40, 78, 40), fill=color, width=stroke)
        draw.line((30, 14, 30, 30), fill=color, width=stroke)
        draw.line((66, 14, 66, 30), fill=color, width=stroke)
        for px in (32, 48, 64):
            for py in (52, 66):
                draw.ellipse((px - 3, py - 3, px + 3, py + 3), fill=color)
    elif kind == "order":
        draw.rounded_rectangle((24, 14, 72, 82), radius=12, outline=color, width=stroke)
        draw.line((34, 34, 62, 34), fill=color, width=stroke)
        draw.line((34, 52, 62, 52), fill=color, width=stroke)
        draw.line((34, 68, 54, 68), fill=color, width=stroke)
    elif kind == "profile":
        draw.ellipse((30, 18, 66, 54), outline=color, width=stroke)
        draw.arc((18, 44, 78, 86), start=200, end=340, fill=color, width=stroke)
    else:
        raise ValueError(f"Unknown tab kind: {kind}")

    canvas.save(OUTPUT_DIR / name)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    extract_subject("logo-source.jpg", "logo.png", 12, 360)
    extract_subject("booking-icon-source.jpg", "booking-icon.png", 18, 320)
    extract_subject("schedule-icon-source.jpg", "schedule-icon.png", 18, 320)
    extract_subject("member-icon-source.jpg", "member-icon.png", 18, 320)
    extract_subject("promo-board-source.jpg", "promo-board.png", 18, 1200)
    extract_subject("claim-button-source.jpg", "claim-button.png", 12, 720)

    active = (232, 214, 178, 255)
    inactive = (162, 151, 123, 255)
    draw_tab_icon("tab-home-active.png", active, "home")
    draw_tab_icon("tab-course.png", inactive, "course")
    draw_tab_icon("tab-order.png", inactive, "order")
    draw_tab_icon("tab-profile.png", inactive, "profile")


if __name__ == "__main__":
    main()
