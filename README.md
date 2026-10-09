# Webstercare Medication Measurement Tool v4

The medication lookup data is now stored in a separate JSON file:

`medications.json`

Example:

```json
[
  {
    "barcode": "9322147031008",
    "drugName": "Cartia",
    "strength": "100mg"
  }
]
```

To add more medication records, add another object separated by a comma, for example:

```json
[
  {
    "barcode": "9322147031008",
    "drugName": "Cartia",
    "strength": "100mg"
  },
  {
    "barcode": "1234567890128",
    "drugName": "Example Drug",
    "strength": "20mg"
  }
]
```

The app loads `medications.json` when it starts. You do not need to edit `index.html` when adding medication records.

Workflow:
1. Select operator.
2. Scan EAN-13 barcode.
3. App looks up barcode in `medications.json`.
4. Displays Barcode, Drug Name and Strength.
5. User confirms/corrects details.
6. Select Bottle or Blister.
7. If Blister, select Material and Rows 1-8.
8. Save the record.
