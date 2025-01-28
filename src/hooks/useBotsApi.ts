import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useMemo } from 'react';
import { BOTS_API_URL } from 'src/configs/api.config';
import { useAuth } from 'src/providers/AuthProvider';
import {
  BotListItem,
  BotSettingsType,
  BotWebChatIntegrResp,
  KnowledgeBaseById,
  KnowledgeBaseItem,
  TelegramUser,
} from 'src/types/bots';
import { Nullable } from 'src/types/objectHelpers';
import { createApiService } from 'src/utils/axios';

export const useBotsApi = () => {
  const { address } = useWeb3ModalAccount();
  const { loggedIn, signOut } = useAuth();

  const botsApiInst = useMemo(() => {
    if (!address) return null;
    if (!loggedIn) return null;

    return createApiService(BOTS_API_URL, address, signOut);
  }, [address, loggedIn]);

  async function fetchTelegramToken() {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<Nullable<TelegramUser>>('/telegramToken');
      return resp.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function fetchTelegramUser() {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<Nullable<TelegramUser>>('/telegramUser');
      return resp.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function fetchUserRefs() {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<{ result: string[] }>('/getReferrals');
      return resp.data.result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  const fetchUserBotsList = async (onError?: (e: unknown) => void) => {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<{ result: BotListItem[] }>('/groups');
      return resp.data.result;
    } catch (e) {
      if (onError) onError(e);
      console.error(e);
      return null;
    }
  };

  const fetchBotKnowledgeBaseList = async (botId: string | number) => {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<{ result: KnowledgeBaseItem[] }>(
        `/groups/${botId}/knowledgeBase/`,
      );
      return resp.data.result;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchKnowledgeBase = async (botId: string | number, baseId: string | number) => {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<{ result: KnowledgeBaseById }>(
        `/groups/${botId}/knowledgeBase/${baseId}`,
      );
      return resp.data.result;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchBot = async (botId: string | number, onError?: () => void) => {
    if (!botsApiInst) return null;

    try {
      const resp = await botsApiInst.get<{ result: BotSettingsType }>(`/groups/${botId}`);

      return resp.data.result;
    } catch (e) {
      if (onError) onError();
      console.error(e);
      return null;
    }
  };

  const patchBot = async (
    botId: string | number,
    itemsForSave: Record<string, any>,
    onError?: () => void,
  ) => {
    if (!botsApiInst) return;

    try {
      await botsApiInst.patch(`/groups/${botId}`, itemsForSave);
    } catch (e) {
      if (onError) onError();
      console.error(e);
    }
  };

  const fetchBotWebchatLink = async (botId: string | number) => {
    if (!botsApiInst) return;

    try {
      const resp = await botsApiInst.get<BotWebChatIntegrResp>(`/groups/${botId}/webchat`);
      return resp.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return {
    fetchTelegramToken,
    fetchTelegramUser,
    fetchUserRefs,
    fetchBotKnowledgeBaseList,
    fetchKnowledgeBase,
    fetchUserBotsList,
    fetchBot,
    fetchBotWebchatLink,
    patchBot,
  };
};
