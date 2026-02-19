import { MATCH_STATUS, type MatchStatus } from "../validation/matches.js";

interface MatchLike {
  startTime: Date;
  endTime: Date;
  status: MatchStatus;
}

export function getMatchStatus(
  startTime: Date,
  endTime: Date,
  now: Date = new Date()
): MatchStatus | null {
  if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
    return null;
  }

  if (now < startTime) return MATCH_STATUS.UPCOMING;
  if (now >= endTime) return MATCH_STATUS.ENDED;

  return MATCH_STATUS.LIVE;
}

export async function syncMatchStatus(
  match: MatchLike,
  updateStatus: (status: MatchStatus) => Promise<void>
): Promise<MatchStatus> {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);

  if (!nextStatus) return match.status;

  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }

  return match.status;
}
