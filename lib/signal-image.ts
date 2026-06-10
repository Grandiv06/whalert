export type SignalImageSource = {
  pictureUrl?: string | null;
  pictureBase64?: string | null;
};

function inferBase64MimeType(raw: string): string {
  if (raw.startsWith("iVBORw0KGgo")) return "image/png";
  if (raw.startsWith("/9j/")) return "image/jpeg";
  if (raw.startsWith("R0lGOD")) return "image/gif";
  if (raw.startsWith("UklGR")) return "image/webp";
  return "image/png";
}

export function resolveSignalImage(signal: SignalImageSource): string | null {
  if (signal.pictureUrl) return signal.pictureUrl;

  if (signal.pictureBase64) {
    const raw = signal.pictureBase64;
    if (raw.startsWith("data:")) return raw;
    return `data:${inferBase64MimeType(raw)};base64,${raw}`;
  }

  return null;
}
