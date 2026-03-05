import { useEffect } from "react";
import { commentarySocket } from "@/lib/ws/commentarysocket";

export function useLiveCommentary(
matchId: number | null,
onCommentary: (data: any) => void
) {
useEffect(() => {
if (!matchId) return;

commentarySocket.connect(matchId, onCommentary);

return () => {
  commentarySocket.unsubscribe();
};


}, [matchId]);
}
