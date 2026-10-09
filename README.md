# Webstercare Medication Measurement Tool v2

This revision fixes iPhone/Safari startup responsiveness.

Key change: the OCR and EAN-13 barcode libraries are now loaded only when needed, so the operator selector and Start New Entry button become active immediately. The main app JavaScript is also transpiled for older Safari compatibility.

# Webstercare Medication Measurement Tool

This is an iPhone-friendly web app/PWA prototype.

## Workflow
1. Select operator: Ian, Anna, Vimlesh, Brett or Sal.
2. Photograph the medication label.
3. OCR attempts to populate Drug Name and Strength.
4. User confirms/edits those fields.
5. Scan an EAN-13 barcode with the camera.
6. Select Packaging:
   - Bottle; or
   - Blister, then select Material (Plastic-Foil or Foil-Foil) and Rows (1-8).
7. Save the entry.
8. The app stores:
   - Operator
   - Drug Name
   - Strength
   - EAN-13 barcode
   - Packaging
   - Material
   - Rows
   - Capture Date
   - Finish Time
9. Stored data can be exported as CSV.

## Running on iPhone
Camera access requires HTTPS (or localhost during development).

For testing:
- Host this folder on any HTTPS-capable web server.
- Open the URL in Safari on the iPhone.
- Allow Camera access.
- In Safari, use Share > Add to Home Screen to install it like an app.

## Notes
- OCR uses Tesseract.js loaded from a CDN.
- Barcode reading uses ZXing loaded from a CDN and is restricted to EAN-13.
- Stored records use browser localStorage on the device.
- For production use, replace localStorage with a central secure database/API if multiple devices need to share data.
