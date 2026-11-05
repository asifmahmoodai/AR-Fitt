Android APK uploads
===================

In Admin → Android App, select an APK (up to 200 MB), enter its version, and
click **Upload and publish APK**. Once the server accepts the completed upload,
visitors can download it at `/download-app`. Links are in the public navigation
and footer. The download is public and does not require a user account.

The authenticated API is `GET`/`POST /admin/app-release` (multipart fields `apk`
and `version`). Public release metadata is `GET /app-release`. The public
`GET`/`HEAD /downloads/ARFitt.apk` route sends an attachment with the Android APK
content type and supports HTTP byte ranges for resumed mobile downloads.

Uploads are stored in `ar-fitt_backend-main/app_releases`, or the absolute path
specified by `APK_RELEASES_DIR`. Back up this directory with the server data.
Metadata is replaced atomically after a valid APK archive is saved. Older APK
files stay available by release ID so updating the app cannot change the bytes
of a download already in progress. Deployments must preserve this directory.

Include `nginx/arfitt-apk-upload.conf` in the API HTTPS server block, run
`nginx -t`, and reload nginx. This increases the upload limit for this endpoint
only. Restart `arfitt-backend.service` after backend changes. Build and deploy
the frontend as usual. No database migration is required.
