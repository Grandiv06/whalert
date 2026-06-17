import type { SubmitSignalFromUserInputDto } from "./api/models/SubmitSignalFromUserInputDto";
import { SignalSide } from "./api/models/SignalSide";

const MAX_SIGNAL_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_SIGNAL_IMAGE_TYPES = /^image\/(jpeg|png|webp|gif)$/i;

export type SignalImageAttachment =
  | {
      kind: "base64";
      imageBase64: string;
    }
  | {
      kind: "file";
      file: File;
    };

export type SubmitSignalWithImageInput = {
  direction: "LONG" | "SHORT";
  symbol: string;
  entryPoint: number;
  stopLoss: number;
  takeProfits: number[];
  description?: string;
  picture: SignalImageAttachment;
};

export type SignalProviderAddNewSignalWithPictureFormData = {
  Symbol?: string;
  EntryPoint?: number;
  Sl?: number;
  TPs?: string;
  PictureId?: string;
  PictureToken?: string;
  Description?: string;
  Side?: SignalSide;
  Picture?: Blob;
};

export function normalizeSignalImageBase64(imageBase64: string): string {
  const trimmed = imageBase64.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("data:")
    ? trimmed
    : `data:image/png;base64,${trimmed}`;
}

export function validateSignalImageFile(file: File): string | null {
  if (!ACCEPTED_SIGNAL_IMAGE_TYPES.test(file.type)) {
    return "فقط تصویر JPG، PNG، WebP یا GIF مجاز است.";
  }
  if (file.size > MAX_SIGNAL_IMAGE_BYTES) {
    return "حداکثر حجم فایل ۵ مگابایت است.";
  }
  return null;
}

export function buildSignalProviderJsonPayload(
  input: Omit<SubmitSignalWithImageInput, "picture"> & {
    picture: Extract<SignalImageAttachment, { kind: "base64" }>;
  },
): SubmitSignalFromUserInputDto {
  const imageBase64 = normalizeSignalImageBase64(input.picture.imageBase64);
  if (!imageBase64) {
    throw new Error("تصویر سیگنال الزامی است.");
  }

  return {
    direction: input.direction,
    symbol: input.symbol,
    entryPoint: input.entryPoint,
    stopLoss: input.stopLoss,
    takeProfits: input.takeProfits,
    description: input.description,
    imageBase64,
  };
}

export function buildSignalProviderMultipartPayload(
  input: Omit<SubmitSignalWithImageInput, "picture"> & {
    picture: Extract<SignalImageAttachment, { kind: "file" }>;
  },
): SignalProviderAddNewSignalWithPictureFormData {
  const validationError = validateSignalImageFile(input.picture.file);
  if (validationError) {
    throw new Error(validationError);
  }

  return {
    Symbol: input.symbol,
    EntryPoint: input.entryPoint,
    Sl: input.stopLoss,
    TPs: JSON.stringify(input.takeProfits),
    Description: input.description,
    Side: input.direction === "LONG" ? SignalSide._1 : SignalSide._2,
    Picture: input.picture.file,
  };
}

export function createSignalSubmissionService({
  submitJson,
  submitMultipart,
}: {
  submitJson: (payload: SubmitSignalFromUserInputDto) => PromiseLike<unknown>;
  submitMultipart: (
    payload: SignalProviderAddNewSignalWithPictureFormData,
  ) => PromiseLike<unknown>;
}) {
  return async function submitSignalWithImage(input: SubmitSignalWithImageInput) {
    if (input.picture.kind === "base64") {
      return submitJson(
        buildSignalProviderJsonPayload(
          input as Omit<SubmitSignalWithImageInput, "picture"> & {
            picture: Extract<SignalImageAttachment, { kind: "base64" }>;
          },
        ),
      );
    }

    return submitMultipart(
      buildSignalProviderMultipartPayload(
        input as Omit<SubmitSignalWithImageInput, "picture"> & {
          picture: Extract<SignalImageAttachment, { kind: "file" }>;
        },
      ),
    );
  };
}
