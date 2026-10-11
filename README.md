# Webstercare Medication Measurement Tool v7

## Changes in v7

- Removed `Capsule` from Tablet -> Shape.
- Added `Unknown` after capsule size 5.
- `Unknown` spans the two remaining spaces beside capsule sizes 4 and 5.
- Added Part 4: Measurements:
  - Length (mm)
  - Width (mm)
  - Thickness (mm)
- Measurements are stored in the local results table and CSV export.

Medication lookup data remains in `medications.json`.


## v7.1 Login screen

The app now requires:
1. Select a user.
2. Enter that user's password.
3. Press Login.
4. The app then shows Start New Entry.

Temporary passwords included in this build:

- Ian — `Ian1234`
- Anna — `Anna1234`
- Vimlesh — `Vimlesh1234`
- Brett — `Brett1234`
- Sal — `Sal1234`

Change these by editing the `USER_PASSWORDS` section in `index.html`.

### Security limitation

This is only a simple access barrier for a static GitHub Pages prototype. The password values exist in client-side source code and can be discovered by someone deliberately inspecting the site's files. Do not treat this as secure authentication for confidential data. Microsoft Entra ID / Azure Static Web Apps should be used for the production version.


## v7.2
- Added Coating? Yes/No after Pill Type.
- Added Marking? free-text entry.
- Tablet only: Score Line? Yes/No, then Shape.
- Added Part 4: Pill Dimensions after Packaging.
- Tablet + Round only: Round Tablet Profile = Convex, Flat, or Thick.
- Existing numeric Length/Width/Thickness section is now Part 5.
- All new fields are stored and exported to CSV.
