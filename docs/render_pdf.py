import fitz
import os

pdf_path = r"e:\Proyectos Propios\GeoServ\docs\manual_finanzas_geoserv.pdf"
out_dir = r"C:\Users\Crist\.gemini\antigravity\brain\128f2794-90bc-4fc7-800f-6a560bdcb1db\scratch"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    out_file = os.path.join(out_dir, f"page_{i}.png")
    pix.save(out_file)
    print(f"Saved {out_file}")
