# Workpod Enduser Interface
This repository contains the frontend for Workpod/Koppero project.

## How to get started
NOTE: FOR THE APP TO WORK PROPERLY, THE BACKEND MUST BE UP AND RUNNING!

1. Clone the repository.
2. Navigate to the `app` directory.
3. Run the following command `npm i` (or `npm install`) in side the `app` directory to download the required dependencies.
4. Create a `.env` file in the `app` directory containing the following lines (fill with real values):
   - VITE_GOOGLE_CLIENT_ID=""
   - VITE_BACKEND_URL=""
6. To run the application in development mode, run the following command `npm run dev`.

### Other useful commands:
- `npm run build` to build the project.
- `npm run check-translations` [need explanation here!]
- `npm run lint` to lint the project, the lint config can be found in `app/eslint.config.js`.
- `npm run test` to run unit tests.

### Configs
- `app/tsconfig.app.json` contains TypeScript specific configs such as import aliases.
- `app/eslint.config.js` contains eslint specific configs.

## Directory structure

```
/
- .github/
--  workflows/ -> Contains GitHub Actions workflows
- app/
--  public/ -> Not used
--  src/
---  api/ -> Contains code related to communicating with the backend.
---  assets/ -> Contains various assets used in the app (fonts, images, etc).
---  auth/ -> Contains code related to authentication.
---  components/ -> Contains all components.
---  hooks/ -> Contains various hooks used within the app like hooks for API data.
---  locales/ -> Contains i18n translations.
---  types/ -> Type definitions.
---  utils/ -> Contains various utility functions, each documented with comments.
```

