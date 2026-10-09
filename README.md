# Webstercare Medication Measurement Tool v6

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


## New in v6
For Blister packaging only, after selecting Rows the user must select:

- Orientation: Straight
- Orientation: Diagonal

Orientation is saved in the stored measurement table and included in CSV export.


## New in v6 — Pill Type

Before Packaging, the app asks:

### Pill Type?
- Capsule
- Soft Capsule
- Tablet

If Capsule:
- Capsule Size: 000, 0E, 00, 0, 1E, 1, 2, 3, 4, 5

If Soft Capsule:
- Clear?: Yes / No

If Tablet:
- Shape: Round, Oval, Capsule, Cylinder, Polygon, Heart, Other

Both Pill Type and its related detail are stored in the measurement table and CSV export.
