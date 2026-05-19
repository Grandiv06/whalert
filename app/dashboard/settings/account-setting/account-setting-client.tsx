"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Link as LinkIcon,
  Camera,
  Upload,
  Trash2,
  Move,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Activity,
  Download,
} from "lucide-react";
import {
  ProfileService,
  SessionService,
  UserDashboardService,
  type CurrentUserProfileEditDto,
  type EditUserProfileOutput,
  type GetCurrentLoginInformationsOutput,
  type GetCurrentAppUserProfilePictureOutput,
} from "@/lib/api/client";
import { ApiError } from "@/lib/api/core/ApiError";
import {
  uploadProfilePicture,
  validateProfileImageFile,
} from "@/lib/profile-avatar-upload";

type AbpWrapper<T> = { result?: T };

function unwrapAbp<T>(res: unknown): T {
  const w = res as AbpWrapper<T>;
  return (w?.result ?? res) as T;
}

async function fetchCurrentLoginInformations(): Promise<GetCurrentLoginInformationsOutput> {
  const res =
    await SessionService.apiServicesAppSessionGetcurrentlogininformationsGet();
  return unwrapAbp<GetCurrentLoginInformationsOutput>(res);
}

/** فارسی/عربی → انگلیسی، سپس فقط رقم ۰–۹ (برای فیلد موبایل). */
function normalizePhoneInput(value: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let out = value;
  for (let i = 0; i < 10; i++) {
    out = out.replaceAll(persian[i]!, String(i));
    out = out.replaceAll(arabic[i]!, String(i));
  }
  return out.replace(/\D/g, "");
}

function profileImageSrc(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }
  return `data:image/jpeg;base64,${raw}`;
}

function extractApiMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, unknown>;
  const err = b.error as Record<string, unknown> | undefined;
  if (typeof b.message === "string") return b.message;
  if (err && typeof err.message === "string") return err.message;
  return undefined;
}


type SaveProfileVariables = {
  name: string;
  surname: string;
  phoneRaw: string;
};

type AvatarToastKind = "success" | "error" | "info";

type AvatarToast = {
  id: number;
  kind: AvatarToastKind;
  message: string;
};

type TelegramConnectResponse = {
  url: string;
  botUsername: string;
  expiresAtUtc: string;
};

type TelegramStatus = "idle" | "loading" | "waiting" | "connected" | "expired" | "error";

type CropSourceImage = {
  src: string;
  fileName: string;
  naturalWidth: number;
  naturalHeight: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const CROP_VIEW_SIZE = 300;
const DEFAULT_META_TRADER_TOKEN = "MT-Token-xxxxx";
const META_TRADER_LATEST_MANIFEST_URL = "https://dl.whalert.net/public/latest.json";
const META_TRADER_PUBLIC_BASE_URL = "https://dl.whalert.net/public/";
const CROP_CIRCLE_SIZE = 210;
const CROP_OUTPUT_SIZE = 512;
const MAX_ZOOM_PERCENT = 300;

async function loadImageDimensions(src: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
    image.onerror = () =>
      reject(new Error("خواندن تصویر انتخاب‌شده ناموفق بود."));
    image.src = src;
  });
}

async function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("آماده‌سازی تصویر برای کراپ ناموفق بود."));
    image.src = src;
  });
}

function sanitizeAvatarFileName(name: string): string {
  const trimmed = name.replace(/\.[^.]+$/, "").trim();
  return trimmed.length > 0 ? trimmed : "avatar";
}

function ProfileAvatarPicker({
  theme,
  avatarSrc,
  profileError,
  onAvatarFile,
  onAvatarRemove,
  avatarPending,
  avatarRemovePending,
  avatarUploadError,
  onAvatarError,
}: {
  theme: string;
  avatarSrc: string | null;
  profileError: boolean;
  onAvatarFile: (file: File) => void;
  onAvatarRemove: () => void;
  avatarPending: boolean;
  avatarRemovePending: boolean;
  avatarUploadError: string | null;
  onAvatarError: (message: string | null) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImage, setCropImage] = useState<CropSourceImage | null>(null);
  const [minScale, setMinScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cropBusy, setCropBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const cropObjectUrlRef = useRef<string | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const displayAvatarSrc = localPreview ?? avatarSrc;
  const hasAvatar = Boolean(displayAvatarSrc);

  const clearCropSource = useCallback(() => {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current);
      cropObjectUrlRef.current = null;
    }
    dragStateRef.current = null;
    setCropImage(null);
    setZoomPercent(100);
    setScale(1);
    setMinScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const clampOffsets = useCallback(
    (nextX: number, nextY: number, nextScale: number) => {
      if (!cropImage) return { x: nextX, y: nextY };
      const renderedWidth = cropImage.naturalWidth * nextScale;
      const renderedHeight = cropImage.naturalHeight * nextScale;
      const maxX = Math.max(0, renderedWidth / 2 - CROP_CIRCLE_SIZE / 2);
      const maxY = Math.max(0, renderedHeight / 2 - CROP_CIRCLE_SIZE / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, nextX)),
        y: Math.min(maxY, Math.max(-maxY, nextY)),
      };
    },
    [cropImage],
  );

  const handleFileSelection = useCallback(
    async (file: File) => {
      const validationError = validateProfileImageFile(file);
      if (validationError) {
        onAvatarError(validationError);
        return;
      }
      onAvatarError(null);
      clearCropSource();
      const imageUrl = URL.createObjectURL(file);
      cropObjectUrlRef.current = imageUrl;
      try {
        const dimensions = await loadImageDimensions(imageUrl);
        const minimumScale = Math.max(
          CROP_CIRCLE_SIZE / dimensions.width,
          CROP_CIRCLE_SIZE / dimensions.height,
        );
        setCropImage({
          src: imageUrl,
          fileName: file.name,
          naturalWidth: dimensions.width,
          naturalHeight: dimensions.height,
        });
        setMinScale(minimumScale);
        setScale(minimumScale);
        setZoomPercent(100);
        setOffset({ x: 0, y: 0 });
        setCropDialogOpen(true);
      } catch (error: unknown) {
        clearCropSource();
        const message =
          error instanceof Error
            ? error.message
            : "بارگذاری تصویر انتخاب‌شده ناموفق بود.";
        onAvatarError(message);
      }
    },
    [clearCropSource, onAvatarError],
  );

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      if (cropObjectUrlRef.current) {
        URL.revokeObjectURL(cropObjectUrlRef.current);
        cropObjectUrlRef.current = null;
      }
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!cropImage || cropBusy) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: offset.x,
        originY: offset.y,
      };
    },
    [cropBusy, cropImage, offset.x, offset.y],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      setOffset(
        clampOffsets(
          dragState.originX + deltaX,
          dragState.originY + deltaY,
          scale,
        ),
      );
    },
    [clampOffsets, scale],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      dragStateRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleZoomChange = useCallback(
    (rawValue: string) => {
      const parsedValue = Number(rawValue);
      if (!Number.isFinite(parsedValue)) return;
      const boundedValue = Math.min(
        MAX_ZOOM_PERCENT,
        Math.max(100, Math.round(parsedValue)),
      );
      const nextScale = minScale * (boundedValue / 100);
      setZoomPercent(boundedValue);
      setScale(nextScale);
      setOffset((currentOffset) =>
        clampOffsets(currentOffset.x, currentOffset.y, nextScale),
      );
    },
    [clampOffsets, minScale],
  );

  const handleApplyCrop = useCallback(async () => {
    if (!cropImage || avatarPending) return;
    setCropBusy(true);
    try {
      const sourceImage = await loadImageElement(cropImage.src);
      const canvas = document.createElement("canvas");
      canvas.width = CROP_OUTPUT_SIZE;
      canvas.height = CROP_OUTPUT_SIZE;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("ایجاد پیش‌نمایش تصویر ناموفق بود.");
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const halfView = CROP_VIEW_SIZE / 2;
      const halfCircle = CROP_CIRCLE_SIZE / 2;
      const renderedWidth = cropImage.naturalWidth * scale;
      const renderedHeight = cropImage.naturalHeight * scale;
      const imageLeft = halfView + offset.x - renderedWidth / 2;
      const imageTop = halfView + offset.y - renderedHeight / 2;
      const cropLeft = halfView - halfCircle;
      const cropTop = halfView - halfCircle;
      const cropSpan = CROP_CIRCLE_SIZE / scale;
      const rawSx = (cropLeft - imageLeft) / scale;
      const rawSy = (cropTop - imageTop) / scale;
      const maxSx = Math.max(0, cropImage.naturalWidth - cropSpan);
      const maxSy = Math.max(0, cropImage.naturalHeight - cropSpan);
      const sx = Math.min(maxSx, Math.max(0, rawSx));
      const sy = Math.min(maxSy, Math.max(0, rawSy));

      context.beginPath();
      context.arc(
        CROP_OUTPUT_SIZE / 2,
        CROP_OUTPUT_SIZE / 2,
        CROP_OUTPUT_SIZE / 2,
        0,
        Math.PI * 2,
      );
      context.closePath();
      context.clip();
      context.drawImage(
        sourceImage,
        sx,
        sy,
        cropSpan,
        cropSpan,
        0,
        0,
        CROP_OUTPUT_SIZE,
        CROP_OUTPUT_SIZE,
      );

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((createdBlob) => resolve(createdBlob), "image/png");
      });
      if (!blob) {
        throw new Error("ساخت فایل خروجی تصویر ناموفق بود.");
      }
      const croppedFile = new File(
        [blob],
        `${sanitizeAvatarFileName(cropImage.fileName)}-crop.png`,
        {
          type: "image/png",
        },
      );

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const previewUrl = URL.createObjectURL(croppedFile);
      objectUrlRef.current = previewUrl;
      setLocalPreview(previewUrl);
      setCropDialogOpen(false);
      clearCropSource();
      onAvatarError(null);
      onAvatarFile(croppedFile);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "برش تصویر انجام نشد. دوباره تلاش کنید.";
      onAvatarError(message);
    } finally {
      setCropBusy(false);
    }
  }, [
    avatarPending,
    clearCropSource,
    cropImage,
    offset.x,
    offset.y,
    onAvatarError,
    onAvatarFile,
    scale,
  ]);

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-right">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          void handleFileSelection(f);
        }}
      />
      <button
        type="button"
        disabled={profileError || avatarPending}
        onClick={() => setActionDialogOpen(true)}
        className="relative group shrink-0 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-60 disabled:pointer-events-none"
        aria-label="انتخاب یا تغییر عکس پروفایل"
      >
        <div
          className={`w-28 h-28 rounded-full overflow-hidden flex items-center justify-center transition-all relative ${
            theme === "dark"
              ? "bg-gradient-to-br from-purple-500/30 to-purple-600/20 ring-2 ring-white/10 group-hover:ring-purple-400/50"
              : "bg-gradient-to-br from-teal-100 to-teal-50 ring-2 ring-teal-200/50 group-hover:ring-teal-400/70"
          }`}
        >
          {displayAvatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayAvatarSrc}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <User
              size={44}
              className={theme === "dark" ? "text-purple-400" : "text-teal-600"}
            />
          )}
          {avatarPending && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/45"
              aria-hidden
            >
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        <span
          className={`absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-105 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          aria-hidden
        >
          <Camera size={16} />
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <h3
          className={`mb-2 text-2xl font-bold sm:text-xl ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          عکس پروفایل
        </h3>
        <p
          className={`mb-2 text-sm leading-7 sm:leading-relaxed ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          روی تصویر یا آیکن دوربین بزنید. پس از انتخاب عکس، قبل از ارسال می‌توانید
          آن را به‌صورت دایره‌ای تنظیم کنید. فرمت‌های مجاز: JPG، PNG، WebP، GIF
          (حداکثر ۵ مگابایت).
        </p>
        {avatarUploadError && (
          <p
            className={`text-sm rounded-lg px-3 py-2 border ${
              theme === "dark"
                ? "text-red-300 bg-red-500/10 border-red-500/30"
                : "text-red-700 bg-red-50 border-red-200"
            }`}
          >
            {avatarUploadError}
          </p>
        )}
      </div>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent
          className={`sm:max-w-sm ${
            theme === "dark"
              ? "bg-[#161023] border-white/10 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle>عملیات عکس پروفایل</DialogTitle>
            <DialogDescription
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            >
              می‌توانید عکس جدید آپلود کنید یا در صورت وجود، عکس فعلی را حذف
              کنید.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              type="button"
              className="w-full justify-center flex-row-reverse"
              disabled={profileError || avatarPending}
              onClick={() => {
                setActionDialogOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <Upload size={16} />
              آپلود عکس جدید
            </Button>

            {hasAvatar && (
              <Button
                type="button"
                variant="destructive"
                className="w-full justify-center flex-row-reverse"
                disabled={profileError || avatarPending}
                onClick={() => {
                  setActionDialogOpen(false);
                  onAvatarError(null);
                  onAvatarRemove();
                }}
              >
                {avatarRemovePending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال حذف…
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    حذف عکس
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={cropDialogOpen}
        onOpenChange={(open) => {
          setCropDialogOpen(open);
          if (!open) {
            clearCropSource();
          }
        }}
      >
        <DialogContent
          className={`sm:max-w-md ${
            theme === "dark"
              ? "bg-[#161023] border-white/10 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle>تنظیم برش عکس</DialogTitle>
            <DialogDescription
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            >
              تصویر را جابه‌جا کنید و با زوم، بخش دلخواه را داخل دایره قرار
              دهید.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className="relative mx-auto overflow-hidden rounded-xl bg-black/70 touch-none select-none"
              style={{ width: CROP_VIEW_SIZE, height: CROP_VIEW_SIZE }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {cropImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cropImage.src}
                  alt=""
                  draggable={false}
                  className="absolute max-w-none pointer-events-none select-none"
                  style={{
                    width: cropImage.naturalWidth * scale,
                    height: cropImage.naturalHeight * scale,
                    left: `calc(50% + ${offset.x}px)`,
                    top: `calc(50% + ${offset.y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
              <div
                className="absolute left-1/2 top-1/2 rounded-full border-2 border-white/90 pointer-events-none"
                style={{
                  width: CROP_CIRCLE_SIZE,
                  height: CROP_CIRCLE_SIZE,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.56)",
                }}
              />
              <div className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[11px] text-white pointer-events-none inline-flex items-center gap-1">
                <Move size={12} />
                جابه‌جایی
              </div>
            </div>

            <div className="space-y-2">
              <div
                className={`flex items-center justify-between text-xs ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <span>زوم</span>
                <span>{zoomPercent}%</span>
              </div>
              <input
                type="range"
                min={100}
                max={MAX_ZOOM_PERCENT}
                value={zoomPercent}
                onChange={(event) => handleZoomChange(event.target.value)}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              disabled={cropBusy}
              onClick={() => {
                setCropDialogOpen(false);
                clearCropSource();
              }}
            >
              انصراف
            </Button>
            <Button
              type="button"
              disabled={cropBusy || avatarPending || !cropImage}
              onClick={() => {
                void handleApplyCrop();
              }}
            >
              {cropBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال آماده‌سازی…
                </>
              ) : (
                "تأیید و آپلود"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccountUserInfoFields({
  profile,
  theme,
  avatarSrc,
  loadingUserInfo,
  profileError,
  onSave,
  savePending,
  pictureVersion,
  onAvatarFile,
  onAvatarRemove,
  avatarPending,
  avatarRemovePending,
  avatarUploadError,
  onAvatarError,
}: {
  profile: CurrentUserProfileEditDto;
  theme: string;
  avatarSrc: string | null;
  loadingUserInfo: boolean;
  profileError: boolean;
  onSave: (vars: SaveProfileVariables) => void;
  savePending: boolean;
  pictureVersion: number;
  onAvatarFile: (file: File) => void;
  onAvatarRemove: () => void;
  avatarPending: boolean;
  avatarRemovePending: boolean;
  avatarUploadError: string | null;
  onAvatarError: (message: string | null) => void;
}) {
  const [name, setName] = useState(profile.name ?? "");
  const [surname, setSurname] = useState(profile.surname ?? "");
  const [phoneNumber] = useState(() =>
    normalizePhoneInput(profile.phoneNumber ?? ""),
  );
  const isPhoneConfirmed = profile.isPhoneNumberConfirmed === true;
  const trimmedName = name.trim();
  const trimmedSurname = surname.trim();
  const normalizedPhone = normalizePhoneInput(phoneNumber);
  const initialName = (profile.name ?? "").trim();
  const initialSurname = (profile.surname ?? "").trim();
  const initialPhone = normalizePhoneInput(profile.phoneNumber ?? "");
  const hasProfileChanges =
    trimmedName !== initialName ||
    trimmedSurname !== initialSurname ||
    normalizedPhone !== initialPhone;

  return (
    <>
      {/* Profile Picture Section */}
      <div
        className={`rounded-xl p-6 border transition-all ${
          theme === "dark"
            ? "bg-white/5 border-white/10 hover:border-white/20"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
        }`}
        dir="rtl"
        style={{ direction: "rtl" }}
      >
        {loadingUserInfo ? (
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row-reverse sm:items-start sm:gap-6 sm:text-right" dir="rtl">
            <Skeleton className="w-28 h-28 rounded-full shrink-0" />
            <div className="flex-1 min-w-0 space-y-3 w-full">
              <Skeleton className="h-7 w-32 mx-auto sm:mr-0 sm:ml-auto" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%] mx-auto sm:mr-0 sm:ml-auto" />
              </div>
            </div>
          </div>
        ) : (
          <ProfileAvatarPicker
            key={pictureVersion}
            theme={theme}
            avatarSrc={avatarSrc}
            profileError={profileError}
            onAvatarFile={onAvatarFile}
            onAvatarRemove={onAvatarRemove}
            avatarPending={avatarPending}
            avatarRemovePending={avatarRemovePending}
            avatarUploadError={avatarUploadError}
            onAvatarError={onAvatarError}
          />
        )}
      </div>

      {/* Personal Information Card */}
      <div
        className={`rounded-xl p-6 border transition-all ${
          theme === "dark"
            ? "bg-white/5 border-white/10 hover:border-white/20"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
        }`}
        dir="rtl"
        style={{ direction: "rtl" }}
      >
        <div className="flex items-center gap-3 mb-6">
          {loadingUserInfo ? (
            <>
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <Skeleton className="h-6 w-32" />
            </>
          ) : (
            <>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                  theme === "dark"
                    ? "bg-purple-500/10 border-purple-500/20"
                    : "bg-purple-50 border-purple-100"
                }`}
              >
                <User
                  size={24}
                  className={
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }
                />
              </div>
              <h3
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                اطلاعات شخصی
              </h3>
            </>
          )}
        </div>

        {loadingUserInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
            <div className="space-y-2">
              <div className="flex justify-end">
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-end">
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-end">
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        ) : profileError ? null : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            dir="rtl"
            style={{ direction: "rtl" }}
          >
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className={`text-sm font-semibold flex items-center gap-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                نام
              </label>
              <Input
                id="firstName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام خود را وارد کنید"
                autoComplete="given-name"
                className={`h-11 rounded-xl text-right ${
                  theme === "dark"
                    ? "bg-white/5 border-white/15 focus:border-purple-500 focus:ring-purple-500/20"
                    : "bg-white border-gray-300/80 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className={`text-sm font-semibold flex items-center gap-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                نام خانوادگی
              </label>
              <Input
                id="lastName"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="نام خانوادگی خود را وارد کنید"
                autoComplete="family-name"
                className={`h-11 rounded-xl text-right ${
                  theme === "dark"
                    ? "bg-white/5 border-white/15 focus:border-purple-500 focus:ring-purple-500/20"
                    : "bg-white border-gray-300/80 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-row-reverse items-center justify-between gap-2">
                {phoneNumber.length > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      isPhoneConfirmed
                        ? theme === "dark"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-emerald-100 text-emerald-700"
                        : theme === "dark"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isPhoneConfirmed ? "تأیید شده" : "تأیید نشده"}
                  </span>
                )}
                <label
                  htmlFor="phone"
                  className={`text-sm font-semibold flex items-center gap-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <Phone size={16} />
                  شماره موبایل
                </label>
              </div>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                enterKeyHint="done"
                autoComplete="tel"
                pattern="[0-9]*"
                maxLength={15}
                readOnly
                value={phoneNumber}
                placeholder="مثال: 09123456789"
                className={`h-11 rounded-xl text-right tabular-nums opacity-80 cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-white/[0.03] border-white/15"
                    : "bg-gray-50 border-gray-200/80"
                }`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className={`text-sm font-semibold flex items-center gap-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <Mail size={16} />
                ایمیل
              </label>
              <Input
                id="email"
                type="email"
                readOnly
                value={profile.emailAddress ?? ""}
                placeholder="—"
                className={`h-11 rounded-xl text-right opacity-80 cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-white/[0.03] border-white/15"
                    : "bg-gray-50 border-gray-200/80"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {hasProfileChanges && (
        <div className="flex justify-start pt-2" dir="rtl">
          <Button
            type="button"
            size="lg"
            disabled={
              loadingUserInfo || !!profileError || savePending || avatarPending
            }
            onClick={() =>
              onSave({
                name: trimmedName,
                surname: trimmedSurname,
                phoneRaw: normalizedPhone,
              })
            }
            className={`inline-flex flex-row-reverse items-center gap-2 px-8 ${
              theme === "dark"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-600/90"
                : "bg-green-600 text-white shadow-lg shadow-green-600/30 hover:bg-green-600/90"
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {savePending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                در حال ذخیره…
              </>
            ) : (
              "ذخیره تغییرات"
            )}
          </Button>
        </div>
      )}
    </>
  );
}

export function AccountSettingClient() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("user-info");
  const [pictureVersion, setPictureVersion] = useState(0);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
    null,
  );
  const [profilePictureIdOverride, setProfilePictureIdOverride] = useState<
    string | null | undefined
  >(undefined);
  const [avatarToasts, setAvatarToasts] = useState<AvatarToast[]>([]);
  const [isMetaTraderTokenCopied, setIsMetaTraderTokenCopied] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus>("idle");
  const [telegramConnectLink, setTelegramConnectLink] = useState<TelegramConnectResponse | null>(null);
  const [pollingActive, setPollingActive] = useState(false);
  const avatarToastTimersRef = useRef<Map<number, number>>(new Map());
  const metaTraderCopiedTimerRef = useRef<number | null>(null);
  const metaTraderTokenInputRef = useRef<HTMLInputElement>(null);
  const { data: metaTraderTokenData } = useQuery({
    queryKey: ["currentUserMt5Token"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetcurrentusermt5TokenGet();
      return unwrapAbp<string>(res);
    },
  });
  const metaTraderToken = metaTraderTokenData?.trim() || DEFAULT_META_TRADER_TOKEN;

  const removeAvatarToast = useCallback((id: number) => {
    const timer = avatarToastTimersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      avatarToastTimersRef.current.delete(id);
    }
    setAvatarToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushAvatarToast = useCallback(
    (message: string, kind: AvatarToastKind) => {
      if (!message) return;
      const id = Date.now() + Math.floor(Math.random() * 10000);
      setAvatarToasts((prev) => [...prev, { id, kind, message }].slice(-4));
      const timer = window.setTimeout(() => {
        removeAvatarToast(id);
      }, 4500);
      avatarToastTimersRef.current.set(id, timer);
    },
    [removeAvatarToast],
  );

  useEffect(() => {
    const timers = avatarToastTimersRef.current;
    return () => {
      for (const timer of timers.values()) {
        window.clearTimeout(timer);
      }
      timers.clear();
      if (metaTraderCopiedTimerRef.current) {
        window.clearTimeout(metaTraderCopiedTimerRef.current);
        metaTraderCopiedTimerRef.current = null;
      }
    };
  }, []);

  const markMetaTraderTokenCopied = useCallback(() => {
    setIsMetaTraderTokenCopied(true);
    if (metaTraderCopiedTimerRef.current) {
      window.clearTimeout(metaTraderCopiedTimerRef.current);
    }
    metaTraderCopiedTimerRef.current = window.setTimeout(() => {
      setIsMetaTraderTokenCopied(false);
      metaTraderCopiedTimerRef.current = null;
    }, 10000);
  }, []);

  const handleAvatarError = useCallback(
    (message: string | null) => {
      setAvatarUploadError(message);
      if (message) {
        pushAvatarToast(message, "error");
      }
    },
    [pushAvatarToast],
  );

  const handleCopyMetaTraderToken = useCallback(async () => {
    if (isMetaTraderTokenCopied) return;
    if (!metaTraderToken) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(metaTraderToken);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      markMetaTraderTokenCopied();
      pushAvatarToast("توکن متاتریدر کپی شد.", "success");
    } catch {
      const input = metaTraderTokenInputRef.current;
      if (!input) {
        pushAvatarToast("کپی توکن ناموفق بود. لطفاً دستی کپی کنید.", "error");
        return;
      }
      try {
        input.removeAttribute("readonly");
        input.focus();
        input.select();
        input.setSelectionRange(0, metaTraderToken.length);
        const copied = document.execCommand("copy");
        input.setAttribute("readonly", "true");
        if (!copied) {
          throw new Error("execCommand copy failed");
        }
        markMetaTraderTokenCopied();
        pushAvatarToast("توکن متاتریدر کپی شد.", "success");
      } catch {
        input.setAttribute("readonly", "true");
        pushAvatarToast("کپی توکن ناموفق بود. لطفاً دستی کپی کنید.", "error");
      }
    }
  }, [
    isMetaTraderTokenCopied,
    markMetaTraderTokenCopied,
    metaTraderToken,
    pushAvatarToast,
  ]);

  const handleDownloadMetaTraderFile = useCallback(async () => {
    try {
      const response = await fetch(META_TRADER_LATEST_MANIFEST_URL, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("latest.json response is not ok");
      }

      const payload = (await response.json()) as { file?: string };
      const file = payload?.file?.trim();
      if (!file) {
        throw new Error("file is missing in latest.json");
      }

      const resolvedUrl = new URL(file, META_TRADER_PUBLIC_BASE_URL).toString();
      const fileNameFromPath = new URL(resolvedUrl).pathname.split("/").pop();
      const downloadName =
        fileNameFromPath && fileNameFromPath.length > 0
          ? fileNameFromPath
          : "metatrader-connector.zip";

      const anchor = document.createElement("a");
      anchor.href = resolvedUrl;
      anchor.download = downloadName;
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch {
      pushAvatarToast("دانلود فایل متاتریدر ناموفق بود. دوباره تلاش کنید.", "error");
    }
  }, [pushAvatarToast]);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["currentUserProfileForEdit"],
    queryFn: async () => {
      const res =
        await ProfileService.apiServicesAppProfileGetcurrentuserprofileforeditGet();
      return unwrapAbp<CurrentUserProfileEditDto>(res);
    },
  });

  useEffect(() => {
    if (profile?.telegramId) {
      setTelegramStatus("connected");
    } else if (telegramStatus === "connected") {
      setTelegramStatus("idle");
    }
  }, [profile?.telegramId, telegramStatus]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (telegramStatus === "waiting" && pollingActive) {
      interval = setInterval(async () => {
        try {
          const { data: updatedProfile } = await refetchProfile();
          if (updatedProfile?.telegramId) {
            setTelegramStatus("connected");
            setPollingActive(false);
            pushAvatarToast("تلگرام با موفقیت متصل شد.", "success");
            return;
          }

          if (telegramConnectLink?.expiresAtUtc) {
            const expiresAt = new Date(telegramConnectLink.expiresAtUtc).getTime();
            const now = new Date().getTime();
            if (now > expiresAt) {
              setTelegramStatus("expired");
              setPollingActive(false);
            }
          }
        } catch (err) {
          console.error("Polling profile failed:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [telegramStatus, pollingActive, refetchProfile, telegramConnectLink, pushAvatarToast]);

  const handleConnectTelegram = useCallback(async () => {
    setTelegramStatus("loading");
    setTelegramConnectLink(null);
    setPollingActive(false);
    try {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGettelegramconnectlinkGet();
      const link = unwrapAbp<TelegramConnectResponse>(res);

      if (!link?.url) {
        throw new Error("Telegram connect link is missing.");
      }

      setTelegramConnectLink(link);
      window.open(link.url, "_blank", "noopener,noreferrer");
      setTelegramStatus("waiting");
      setPollingActive(true);
    } catch (error) {
      console.error("GetTelegramConnectLink failed:", error);
      setTelegramStatus("error");
      setPollingActive(false);
      pushAvatarToast("دریافت لینک اتصال به تلگرام ناموفق بود.", "error");
    }
  }, [pushAvatarToast]);

  const { data: pictureOut, isLoading: pictureLoading } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet();
      return unwrapAbp<GetCurrentAppUserProfilePictureOutput>(res);
    },
  });

  const { data: currentLoginInfo } = useQuery({
    queryKey: ["currentLoginInformations"],
    queryFn: fetchCurrentLoginInformations,
  });
  const profilePictureId =
    profilePictureIdOverride !== undefined
      ? profilePictureIdOverride
      : (currentLoginInfo?.user?.profilePictureId ?? null);

  const syncProfilePictureId = useCallback(async () => {
    const freshLoginInfo = await queryClient.fetchQuery({
      queryKey: ["currentLoginInformations"],
      queryFn: fetchCurrentLoginInformations,
    });
    setProfilePictureIdOverride(freshLoginInfo.user?.profilePictureId ?? null);
  }, [queryClient]);

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess: async () => {
      setAvatarUploadError(null);
      setPictureVersion((v) => v + 1);
      queryClient.invalidateQueries({ queryKey: ["profilePicture"] });
      await syncProfilePictureId();
      pushAvatarToast("عکس پروفایل با موفقیت آپلود شد.", "success");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "آپلود تصویر ناموفق بود.";
      setAvatarUploadError(msg);
      pushAvatarToast(msg, "error");
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!profile) {
        throw new Error(
          "اطلاعات کاربر در دسترس نیست. یک‌بار صفحه را رفرش کنید.",
        );
      }
      const phone = normalizePhoneInput(profile.phoneNumber ?? "");
      await UserDashboardService.apiServicesAppUserdashboardEditinguserprofilePost(
        {
          name: profile.name ?? "",
          surname: profile.surname ?? "",
          phoneNumber: phone.length > 0 ? phone : null,
          profilePictureId: null,
        },
      );
    },
    onSuccess: () => {
      setAvatarUploadError(null);
      setProfilePictureIdOverride(null);
      setPictureVersion((v) => v + 1);
      queryClient.invalidateQueries({ queryKey: ["profilePicture"] });
      queryClient.invalidateQueries({ queryKey: ["currentLoginInformations"] });
      pushAvatarToast("عکس پروفایل حذف شد.", "success");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "حذف تصویر ناموفق بود.";
      setAvatarUploadError(msg);
      pushAvatarToast(msg, "error");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: SaveProfileVariables) => {
      if (!input.name || !input.surname) {
        throw new Error("نام و نام خانوادگی الزامی است.");
      }
      let effectiveProfilePictureId = profilePictureId;
      if (effectiveProfilePictureId === null && pictureOut?.profilePicture) {
        const freshLoginInfo = await fetchCurrentLoginInformations();
        effectiveProfilePictureId =
          freshLoginInfo.user?.profilePictureId ?? null;
        setProfilePictureIdOverride(effectiveProfilePictureId);
      }
      const phone = normalizePhoneInput(input.phoneRaw);
      const body: {
        name: string;
        surname: string;
        phoneNumber?: string | null;
        profilePictureId?: string | null;
      } = {
        name: input.name,
        surname: input.surname,
        phoneNumber: phone.length > 0 ? phone : null,
        profilePictureId: effectiveProfilePictureId,
      };
      const res =
        await UserDashboardService.apiServicesAppUserdashboardEditinguserprofilePost(
          body,
        );
      return unwrapAbp<EditUserProfileOutput>(res);
    },
    onSuccess: (out) => {
      pushAvatarToast("تغییرات با موفقیت ذخیره شد.", "success");
      if (out.profilePictureId !== undefined) {
        setProfilePictureIdOverride(out.profilePictureId ?? null);
      }
      queryClient.invalidateQueries({
        queryKey: ["currentUserProfileForEdit"],
      });
      queryClient.invalidateQueries({ queryKey: ["profilePicture"] });
      queryClient.invalidateQueries({ queryKey: ["currentLoginInformations"] });
    },
    onError: (err: unknown) => {
      let message = "ذخیره با خطا مواجه شد.";
      if (err instanceof ApiError) {
        message = extractApiMessage(err.body) ?? err.message ?? message;
      } else if (err instanceof Error) {
        message = err.message || message;
      }
      pushAvatarToast(message, "error");
    },
  });


  const avatarSrc = profileImageSrc(pictureOut?.profilePicture ?? undefined);
  const avatarPending =
    uploadAvatarMutation.isPending || removeAvatarMutation.isPending;
  const loadingUserInfo = profileLoading || pictureLoading;
  const profileFormKey = profile
    ? [
        profile.userName,
        profile.name,
        profile.surname,
        profile.phoneNumber ?? "",
        profile.emailAddress ?? "",
      ].join("|")
    : "";

  return (
    <div
      className="w-full max-w-6xl mx-auto text-right"
      dir="rtl"
      style={{ direction: "rtl" }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          تنظیمات حساب کاربری
        </h1>
        <p
          className={`mt-2 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          مدیریت اطلاعات شخصی، امنیت و یکپارچه‌سازی حساب کاربری شما
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs Navigation */}
        <div className="mb-6" dir="rtl" style={{ direction: "rtl" }}>
          <TabsList
            className={`flex flex-row w-full gap-2 h-auto p-1.5 ${
              theme === "dark" ? "bg-white/5" : "bg-gray-100"
            }`}
            dir="rtl"
            style={{ direction: "rtl" }}
          >
            <TabsTrigger
              value="user-info"
              className={`flex flex-1 items-center justify-center gap-2 py-3 px-4 rounded-md transition-all cursor-pointer ${
                theme === "dark"
                  ? "data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-gray-400 hover:text-white"
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>اطلاعات کاربری</span>
              <User size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="integration"
              className={`flex flex-1 items-center justify-center gap-2 py-3 px-4 rounded-md transition-all cursor-pointer ${
                theme === "dark"
                  ? "data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-gray-400 hover:text-white"
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>یکپارچه‌سازی</span>
              <LinkIcon size={18} />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content */}
        <div
          className={`rounded-2xl border shadow-lg overflow-hidden transition-colors ${
            theme === "dark"
              ? "bg-[rgba(2,0,11,0.3)] border-white/10 backdrop-blur-sm"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Tab Contents */}
          <div className="p-6">
            {/* User Information Tab */}
            <TabsContent value="user-info" className="mt-0">
              <div className="space-y-6">
                {profileError && (
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border px-4 py-3 ${
                      theme === "dark"
                        ? "border-red-500/40 bg-red-500/10 text-red-200"
                        : "border-red-200 bg-red-50 text-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-2 text-right">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-sm">
                        بارگذاری اطلاعات کاربری ناموفق بود. دوباره تلاش کنید.
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => refetchProfile()}
                    >
                      تلاش مجدد
                    </Button>
                  </div>
                )}


                {!profile && !profileError && loadingUserInfo && (
                  <div className="space-y-6">
                    <div
                      className={`rounded-xl p-6 border ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-gray-200 shadow-sm"
                      }`}
                      dir="rtl"
                    >
                      <div className="flex flex-col items-center gap-4 text-center sm:flex-row-reverse sm:items-start sm:gap-6 sm:text-right">
                        <Skeleton className="w-28 h-28 rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 space-y-3 w-full">
                          <Skeleton className="h-7 w-32 mx-auto sm:mr-0 sm:ml-auto" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%] mx-auto sm:mr-0 sm:ml-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`rounded-xl p-6 border ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-gray-200 shadow-sm"
                      }`}
                      dir="rtl"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-end">
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-end">
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-end">
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start pt-2" dir="rtl">
                      <Skeleton className="h-12 w-40 rounded-lg" />
                    </div>
                  </div>
                )}

                {profile && (
                  <AccountUserInfoFields
                    key={profileFormKey}
                    profile={profile}
                    theme={theme}
                    avatarSrc={avatarSrc}
                    loadingUserInfo={loadingUserInfo}
                    profileError={profileError}
                    savePending={saveMutation.isPending}
                    pictureVersion={pictureVersion}
                    avatarPending={avatarPending}
                    avatarRemovePending={removeAvatarMutation.isPending}
                    avatarUploadError={avatarUploadError}
                    onAvatarError={handleAvatarError}
                    onAvatarFile={(file) => uploadAvatarMutation.mutate(file)}
                    onAvatarRemove={() => removeAvatarMutation.mutate()}
                    onSave={(vars) => {
                      saveMutation.mutate(vars);
                    }}
                  />
                )}
              </div>
            </TabsContent>

            {/* Integration Tab */}
            <TabsContent value="integration" className="mt-0">
              <div className="space-y-6" dir="rtl" style={{ direction: "rtl" }}>
                {/* Telegram Integration */}
                <div
                  className={`rounded-xl p-6 border transition-all  ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 hover:border-white/20"
                      : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                  dir="rtl"
                  style={{ direction: "rtl" }}
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4 text-right">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                          telegramStatus === "connected"
                            ? theme === "dark"
                              ? "bg-green-500/10 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                              : "bg-green-50 border-green-100"
                            : theme === "dark"
                            ? "bg-blue-500/10 border-blue-500/20"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        {telegramStatus === "connected" ? (
                          <CheckCircle2
                            size={28}
                            className={
                              theme === "dark" ? "text-green-400" : "text-green-600"
                            }
                          />
                        ) : (
                          <Send
                            size={28}
                            className={
                              theme === "dark" ? "text-blue-400" : "text-blue-600"
                            }
                          />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          تلگرام
                        </h3>
                        <div
                          className={`text-sm leading-relaxed ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {telegramStatus === "connected" ? (
                            <div className="flex items-center gap-2 text-green-500 font-medium">
                              <span>تلگرام متصل شد</span>
                              {profile?.telegramId && (
                                <span dir="ltr" className="opacity-70 text-xs">({profile.telegramId})</span>
                              )}
                            </div>
                          ) : telegramStatus === "loading" ? (
                            "در حال ایجاد لینک اتصال به تلگرام..."
                          ) : telegramStatus === "waiting" ? (
                            <div className="space-y-1">
                              <p className="text-blue-400">در انتظار زدن دکمه Start در تلگرام...</p>
                              {telegramConnectLink && (
                                <button 
                                  onClick={() => window.open(telegramConnectLink.url, "_blank")}
                                  className="text-xs underline hover:text-blue-300"
                                >
                                  لینک باز نشد؟ دوباره کلیک کنید
                                </button>
                              )}
                            </div>
                          ) : telegramStatus === "expired" ? (
                            <span className="text-red-400">لینک اتصال منقضی شده است. لطفا دوباره تلاش کنید.</span>
                          ) : telegramStatus === "error" ? (
                            <span className="text-red-400">خطا در برقراری ارتباط. لطفا دوباره تلاش کنید.</span>
                          ) : (
                            "برای دریافت سیگنال‌ها در تلگرام، حساب خود را متصل کنید"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0">
                      {telegramStatus === "connected" ? (
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                          theme === "dark" ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700"
                        }`}>
                          <CheckCircle2 size={16} />
                          متصل
                        </div>
                      ) : (
                        <Button
                          variant={telegramStatus === "expired" || telegramStatus === "error" ? "destructive" : "default"}
                          size="lg"
                          className={`w-full md:w-auto font-bold px-8 h-12 rounded-xl transition-all ${
                            telegramStatus === "waiting" 
                              ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" 
                              : "shadow-lg"
                          }`}
                          onClick={handleConnectTelegram}
                          disabled={telegramStatus === "loading" || telegramStatus === "waiting"}
                        >
                          {telegramStatus === "loading" ? (
                            <>
                              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                              در حال پردازش...
                            </>
                          ) : telegramStatus === "waiting" ? (
                            <>
                              <Activity className="ml-2 h-5 w-5 animate-pulse" />
                              در انتظار تایید...
                            </>
                          ) : telegramStatus === "expired" || telegramStatus === "error" ? (
                            "تلاش مجدد"
                          ) : (
                            "اتصال به تلگرام"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* MetaTrader Integration */}
                <div
                  className={`rounded-xl p-6 border transition-all ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 hover:border-white/20"
                      : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                  dir="rtl"
                  style={{ direction: "rtl" }}
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3 text-right">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                          theme === "dark" 
                            ? "bg-teal-500/10 border-teal-500/20" 
                            : "bg-teal-50 border-teal-100"
                        }`}
                      >
                        <Activity
                          size={24}
                          className={
                            theme === "dark" ? "text-teal-400" : "text-teal-600"
                          }
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-bold mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          متاتریدر (MetaTrader)
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          توکن اتصال حساب متاتریدر شما به‌صورت پیش‌فرض صادر شده است
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-10 w-full md:w-auto px-4 rounded-xl border border-[#A87FF3]/40 bg-gradient-to-br from-[#542C85] to-[#7C4DCC] text-white shadow-[0_0_20px_-6px_rgba(124,77,204,0.9)] transition-all duration-200 hover:scale-[1.02] hover:brightness-110 cursor-pointer"
                        onClick={handleCopyMetaTraderToken}
                      >
                        {isMetaTraderTokenCopied ? "کپی شد" : "کپی توکن"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-10 w-10 shrink-0 p-0 rounded-xl border border-[#A87FF3]/40 bg-gradient-to-br from-[#542C85] to-[#7C4DCC] text-white shadow-[0_0_20px_-6px_rgba(124,77,204,0.9)] transition-all duration-200 hover:scale-105 hover:brightness-110 cursor-pointer"
                        onClick={handleDownloadMetaTraderFile}
                        aria-label="دانلود فایل متاتریدر"
                        title="دانلود فایل متاتریدر"
                      >
                        <Download className="h-[18px] w-[18px] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 w-full md:w-1/2 md:mr-auto">
                    <Input
                      ref={metaTraderTokenInputRef}
                      readOnly
                      value={metaTraderToken}
                      dir="ltr"
                      style={{ direction: "ltr", textAlign: "left" }}
                      className={
                        theme === "dark"
                          ? "h-11 rounded-xl border-white/15 bg-black/20 text-left text-white opacity-80 cursor-not-allowed"
                          : "h-11 rounded-xl border-gray-200/80 bg-gray-50 text-left text-gray-900 opacity-80 cursor-not-allowed"
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[1000] flex w-[min(92vw,360px)] flex-col gap-2 pointer-events-none">
            {avatarToasts.map((toast) => (
              <div
                key={toast.id}
                className="pointer-events-auto rounded-xl border border-[#A87FF3]/40 bg-[#542C85]/25 px-4 py-3 text-white shadow-lg backdrop-blur-sm transition-all"
                dir="rtl"
              >
                <div className="flex items-start gap-2">
                  {toast.kind === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#CDB7FF]" />
                  ) : toast.kind === "error" ? (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#CDB7FF]" />
                  ) : (
                    <Camera className="mt-0.5 h-5 w-5 shrink-0 text-[#CDB7FF]" />
                  )}
                  <p className="text-sm leading-6">{toast.message}</p>
                </div>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
