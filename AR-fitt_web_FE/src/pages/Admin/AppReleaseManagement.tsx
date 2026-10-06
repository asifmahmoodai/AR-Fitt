import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { adminService } from "../../services/admin.service";
import { AppRelease, formatApkSize, getApkDownloadUrl } from "../../services/appRelease.service";
import { AdminPageHeader } from "./AdminUI";

const MAX_APK_SIZE = 200 * 1024 * 1024;

const AppReleaseManagement: React.FC = () => {
  const [release, setRelease] = useState<AppRelease | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    adminService.getAppRelease()
      .then((current) => { if (active) setRelease(current); })
      .catch(() => { if (active) setAlert({ severity: "error", message: "Unable to load the current app release. Please refresh this page." }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] || null;
    setAlert(null);
    setFile(null);
    if (!chosen) return;
    if (!/\.apk$/i.test(chosen.name) || chosen.size === 0 || chosen.size > MAX_APK_SIZE) {
      setAlert({ severity: "error", message: "Choose a non-empty .apk file, up to 200 MB." });
      event.target.value = "";
      return;
    }
    setFile(chosen);
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !version.trim()) return;
    setUploading(true);
    setProgress(0);
    setAlert(null);
    try {
      const published = await adminService.uploadApk(file, version.trim(), setProgress);
      setRelease(published);
      setFile(null);
      setVersion("");
      if (fileInput.current) fileInput.current.value = "";
      setAlert({ severity: "success", message: "APK uploaded. Visitors can now download it from the website." });
    } catch (error: any) {
      setAlert({ severity: "error", message: error.response?.status === 413
        ? "The APK must be 200 MB or smaller."
        : error.response?.data?.message || "Upload failed. Please try again." });
    } finally { setUploading(false); }
  };

  return (
    <Box>
      <AdminPageHeader title="Android App" description="Publish APK updates for visitors to download from your website." />
      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 800 }}>
      <Stack spacing={3}>
      {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
      {loading ? <CircularProgress aria-label="Loading app release" size={24} /> : (
        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>Current download</Typography>
          {release ? (
            <Stack spacing={1}>
              <Typography>Version {release.version} · {formatApkSize(release.size)}</Typography>
              <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>{release.fileName}</Typography>
              <Typography variant="body2" color="text.secondary">Uploaded {new Date(release.uploadedAt).toLocaleString()}</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button component="a" href={getApkDownloadUrl(release)} download="ARFitt.apk">Download current APK</Button>
                <Button component="a" href="/download-app" target="_blank" rel="noopener noreferrer">View download page</Button>
              </Stack>
            </Stack>
          ) : <Typography color="text.secondary">No APK uploaded yet.</Typography>}
        </Box>
      )}
      <Stack component="form" spacing={2} onSubmit={upload}>
        <Typography variant="h6">{release ? "Upload a new version" : "Upload your APK"}</Typography>
        <TextField label="App version" value={version} onChange={(event) => setVersion(event.target.value)}
          required disabled={uploading} inputProps={{ maxLength: 40 }} helperText="For example: 1.0.0" />
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} disabled={uploading}>
          Choose APK file
          <input ref={fileInput} type="file" accept=".apk,application/vnd.android.package-archive" hidden onChange={selectFile} disabled={uploading} />
        </Button>
        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>{file ? `${file.name} · ${formatApkSize(file.size)}` : "APK files only · Maximum 200 MB"}</Typography>
        {uploading && <Box role="status">
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" sx={{ mt: 1 }}>{progress < 100 ? `Uploading… ${progress}%` : "Publishing APK…"}</Typography>
        </Box>}
        <Button type="submit" variant="contained" disabled={loading || uploading || !file || !version.trim()}>
          {uploading ? "Uploading…" : "Upload and publish APK"}
        </Button>
        <Typography variant="body2" color="text.secondary">The completed upload becomes the current website download automatically.</Typography>
      </Stack>
    </Stack>
    </Paper>
    </Box>
  );
};

export default AppReleaseManagement;
