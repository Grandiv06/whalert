import {
  UserDashboardService,
  type SignalManagementMessageDto,
} from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };

export function unwrapSignalManagementMessages(
  value: unknown,
): SignalManagementMessageDto[] {
  if (Array.isArray(value)) return value;
  const wrapped = value as AbpWrapper<SignalManagementMessageDto[]>;
  if (Array.isArray(wrapped?.result)) return wrapped.result;
  return [];
}

export function sortSignalManagementMessages(
  messages: SignalManagementMessageDto[],
): SignalManagementMessageDto[] {
  return [...messages].sort((a, b) => {
    const aTime = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const bTime = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function fetchSignalManagementMessages(
  tradingSignalId: number,
): Promise<SignalManagementMessageDto[]> {
  const res =
    await UserDashboardService.apiServicesAppUserdashboardGetsignalmanagementmessagesPost(
      { tradingSignalId },
    );
  return sortSignalManagementMessages(unwrapSignalManagementMessages(res));
}
