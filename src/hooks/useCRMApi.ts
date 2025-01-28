import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import axios from 'axios';
import { useAuth } from 'src/providers/AuthProvider';
import { BotChatHistory, BotConversationsList, BotsListResp } from 'src/types/conversation';

const testAxiosInst = axios.create({
  baseURL: 'https://dionysus-ai.cloud:34780/affiliate/crm',
  headers: {
    Authorization: 'Bearer J5CSxzXtRGAbidRDhfNAdsdk9yKeK9SAl9AtlUELP2SNI6Ie9rfmBg',
  },
});

export const useCRMApi = () => {
  const { address } = useWeb3ModalAccount();
  const { loggedIn, tgUser, signOut } = useAuth();

  // const botsApiInst = useMemo(() => {
  //   if (!address) return null;
  //   if (!loggedIn) return null;
  //
  //   return createApiService(address, signOut);
  // }, [address, loggedIn]);

  async function fetchBotsList() {
    try {
      const resp = await testAxiosInst.get<BotsListResp>('/bot/list');
      return resp.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function fetchBotConversations(botId: string) {
    try {
      const resp = await testAxiosInst.get<BotConversationsList>(`/bot/last-messages/${botId}`);
      return resp.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function fetchBotChatHistory(chatId: string) {
    try {
      const resp = await testAxiosInst.get<BotChatHistory>(`/chat/history/${chatId}`);
      return resp.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return { fetchBotsList, fetchBotConversations, fetchBotChatHistory };
};
