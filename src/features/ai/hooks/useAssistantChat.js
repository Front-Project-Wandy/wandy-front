import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { chatWithAssistant } from '../../../services/aiService';
import { getCityPlaces, getPlace } from '../../../services/placeService';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { summarizeTripCost } from '../../budget/utils/summarizeTripCost';
import { applyAssistantActions } from '../utils/applyAssistantActions';
import { buildAssistantContext } from '../utils/buildAssistantContext';
import { MAX_HISTORY } from '../utils/buildAssistantRequest';
import { validateAssistantActions } from '../utils/validateAssistantActions';

let nextMessageId = 0;
const createId = () => {
  nextMessageId += 1;
  return `assistant-message-${nextMessageId}`;
};

// 구글 장소는 이름을 저장하지 않아서(약관) 비서에게 보낼 때만 placeId로 불러온다. 못 불러오면 이름 없이 보낸다.
const loadItemNames = async (trip) => {
  const items = trip.days.flatMap((day) => day.items);
  const entries = await Promise.all(
    items.map(async (item) => {
      if (item.name) return [item.id, item.name];
      const place = await getPlace(item.placeId).catch(() => null);
      return [item.id, place?.name ?? null];
    }),
  );
  return Object.fromEntries(entries);
};

// 대화형 여행 비서 (101). 대화는 화면에만 두고(여행이 바뀌면 key로 새로 시작), 일정 변경 제안은
// 사용자가 [적용]을 눌러야 store에 들어간다.
// messages: [{ id, role: 'user'|'assistant', text, actions?, droppedCount?, source?, status?: 'pending'|'applied'|'dismissed' }]
export function useAssistantChat(trip) {
  const [messages, setMessages] = useState([]);
  // 실패했을 때 [다시 시도]가 같은 대화를 다시 보낼 수 있게 마지막 요청을 들고 있는다
  const lastHistoryRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async (history) => {
      const [candidates, itemNames] = await Promise.all([getCityPlaces(trip), loadItemNames(trip)]);
      const context = buildAssistantContext({
        trip,
        itemNames,
        candidates,
        cost: summarizeTripCost(trip),
      });
      const raw = await chatWithAssistant({ history, context });
      const { actions, droppedCount } = validateAssistantActions(raw.actions, { trip, candidates });
      return { reply: raw.reply, actions, droppedCount, source: raw.source };
    },
    onSuccess: (result) => {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'assistant',
          text: result.reply,
          actions: result.actions,
          droppedCount: result.droppedCount,
          source: result.source,
          status: result.actions.length > 0 ? 'pending' : null,
        },
      ]);
    },
  });

  const request = (history) => {
    lastHistoryRef.current = history;
    mutation.mutate(history);
  };

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next = [...messages, { id: createId(), role: 'user', text: trimmed }];
    setMessages(next);
    request(next.slice(-MAX_HISTORY).map(({ role, text: body }) => ({ role, text: body })));
  };

  const retry = () => {
    if (lastHistoryRef.current) request(lastHistoryRef.current);
  };

  const setStatus = (messageId, status) =>
    setMessages((current) =>
      current.map((message) => (message.id === messageId ? { ...message, status } : message)),
    );

  const apply = (messageId) => {
    const message = messages.find((item) => item.id === messageId);
    if (message?.status !== 'pending') return;
    applyAssistantActions(usePlanStore, message.actions);
    setStatus(messageId, 'applied');
  };

  const dismiss = (messageId) => setStatus(messageId, 'dismissed');

  return {
    messages,
    send,
    retry,
    apply,
    dismiss,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
