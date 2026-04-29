import axios from "axios";
import { getApiBaseUrl } from "@/config/env";
import { UserDashboardService } from "@/lib/api/client";

function parseErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, unknown>;
  const err = b.error as Record<string, unknown> | undefined;
  if (typeof b.message === "string") return b.message;
  if (err && typeof err.message === "string") return err.message;
  return undefined;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT_TYPES = /^image\/(jpeg|png|webp|gif)$/i;

export function validateProfileImageFile(file: File): string | null {
  if (!ACCEPT_TYPES.test(file.type)) {
    return "فقط تصویر JPG، PNG، WebP یا GIF مجاز است.";
  }
  if (file.size > MAX_BYTES) {
    return "حداکثر حجم فایل ۵ مگابایت است.";
  }
  return null;
}

export async function uploadProfilePicture(file: File): Promise<void> {
  const validation = validateProfileImageFile(file);
  if (validation) throw new Error(validation);

  const form = new FormData();
  form.append("file", file);
  try {
    await UserDashboardService.apiServicesAppUserdashboardUploadandapplyprofilepicturePost(
      {
        file,
      },
    );
    return;
  } catch {
    // Fallback to raw axios for servers that reject generated client payload shape.
  }

  const base = getApiBaseUrl().replace(/\/$/, "");
  const uploadUrl = `${base}/api/services/app/UserDashboard/UploadAndApplyProfilePicture`;
  const res = await axios.post(uploadUrl, form, {
    maxRedirects: 0,
    validateStatus: () => true,
  });
  if (res.status === 302 || res.status === 401) {
    throw new Error("نشست شما منقضی شده یا دسترسی ندارید. دوباره وارد شوید.");
  }
  if (res.status < 200 || res.status >= 300) {
    throw new Error(parseErrorMessage(res.data) ?? `آپلود تصویر ناموفق (${res.status})`);
  }
}
