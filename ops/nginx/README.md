ARFitt's Camera Kit API proxy
===========================

Include `arfitt-camera-kit.conf` inside the HTTPS server block for `arfitt.com`,
then run `nginx -t` before reloading nginx. The snippet forwards only the Camera
Kit service paths to the fixed Snap API upstream, including initialization,
lens loading, metrics, and remote configuration.

Build the frontend with `REACT_APP_CAMERA_KIT_API_HOSTNAME=arfitt.com` and an
enabled Camera Kit token in `REACT_APP_CAMERA_KIT_API_TOKEN`. The same hostname
is used by the SDK and the custom Hosted WebAR lens source. Lens rendering
assets still download from Snap's CDN.

The staging token passed initialization on October 5, 2026. The supplied
production token returned gRPC status 7 (permission denied), so staging remains
the active token. Switch `REACT_APP_CAMERA_KIT_API_TOKEN` to production only
after Snap enables it, then rebuild and redeploy the frontend. Merely changing
`.env` does not update the token in an existing frontend build.
