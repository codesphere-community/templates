# Flutter Weather

This template is a Flutter for Web weather app that asks for a city, resolves it with the free Open-Meteo geocoding API, and displays current weather conditions without requiring an API key.

## Run Locally

```bash
./scripts/ensure_flutter.sh
export PATH="$PWD/.flutter/bin:$PATH"
flutter pub get
flutter run -d chrome --web-hostname 0.0.0.0 --web-port 3000
```

## Build

```bash
./scripts/ensure_flutter.sh
export PATH="$PWD/.flutter/bin:$PATH"
flutter pub get
flutter build web --release
```

## Codesphere

The included `ci.yml` installs Flutter into `.flutter` when needed, enables web support, installs dependencies, builds the web app, and serves `build/web` on port `3000`.

## What This Template Demonstrates

- Flutter for Web project structure.
- Calling a free public API from a Flutter app.
- Loading, success, empty, and error states.
- Responsive UI for desktop and mobile web.
- Codesphere CI pipeline deployment.

## Article Draft

### Building a Flutter Weather App for the Web on Codesphere

Flutter is often associated with mobile apps, but the same framework can also ship polished web interfaces. This template demonstrates that workflow with a small weather app that runs in the browser and deploys through a Codesphere CI pipeline.

The app starts with a city search field. When a user enters a location, it calls Open-Meteo's geocoding endpoint to find coordinates, then requests current weather data for that latitude and longitude. Because Open-Meteo offers free endpoints without an API key, the template can be run immediately after cloning.

The interface uses a single Flutter app with clear state handling: an idle prompt before search, a loading state while the API calls run, an error state for failed or unknown locations, and a weather card for successful results. That makes it a useful starter for other API-driven Flutter web apps.

In Codesphere, the `ci.yml` file handles setup. It installs Flutter if the workspace does not already have it, runs `flutter pub get`, builds the web release, and serves the generated `build/web` directory on port `3000`. From there, developers can replace the weather API with their own backend, add saved locations, or turn the app into a broader dashboard.
