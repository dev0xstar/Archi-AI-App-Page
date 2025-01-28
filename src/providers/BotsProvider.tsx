import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet, useParams } from 'react-router-dom';
import { useBotsApi } from 'src/hooks/useBotsApi';
import { Bot, BotListItem, BotSettingsType, KnowledgeBaseItem } from 'src/types/bots';
import { FCC } from 'src/types/FCC';

type BotsProviderCtxState = {
  bots: BotListItem[] | null;
  fetchingBots: boolean;
  fetchBotsList: (force?: boolean) => Promise<void>;
  currentBot: Bot | null;
  fetchingCurrentBot: boolean;
  fetchBotInfo: () => Promise<void>;
};

const initBotsProviderCtx = {
  bots: null,
  fetchingBots: true,
  currentBot: null,
  fetchingCurrentBot: true,
  fetchBotsList: async () => {},
  fetchBotInfo: async () => {},
};

const BotsProviderCtx = createContext<BotsProviderCtxState>(initBotsProviderCtx);

export const BotsProvider: FCC = ({ children }) => {
  const { address } = useWeb3ModalAccount();
  const { botId } = useParams();
  const { fetchBot, fetchUserBotsList, fetchBotKnowledgeBaseList } = useBotsApi();

  const [bots, setBots] = useState<BotsProviderCtxState['bots']>(null);
  const [fetchingBots, setFetchingBots] = useState<BotsProviderCtxState['fetchingBots']>(true);
  const [currentBotSettings, setCurrentBotSettings] = useState<BotSettingsType | null>(null);
  const [currentBotKnowledgeBase, setCurrentBotKnowledgeBase] = useState<
    KnowledgeBaseItem[] | null
  >(null);
  const [fetchingCurrentBot, setFetchingCurrentBot] = useState(true);

  useEffect(() => {
    if (!address) {
      setBots(null);
      return;
    }

    fetchBotsList(true);
  }, [address]);

  const getToken = () => localStorage.getItem(`token-${address}`);

  const fetchBotInfo = async () => {
    if (!botId || !address) return;

    setFetchingCurrentBot(true);
    try {
      await Promise.all([getBotById(), fetchBotKnowledgeBase()]);
    } catch (error) {
      toast.error('Failed to fetch bot info');
    } finally {
      setFetchingCurrentBot(false);
    }
  };

  const fetchBotKnowledgeBase = async () => {
    if (!botId || !address) {
      setCurrentBotKnowledgeBase(null);
      return;
    }

    const token = getToken();

    if (!token) {
      setCurrentBotKnowledgeBase(null);
      console.warn('Token not found');
      return;
    }

    const knowledge = await fetchBotKnowledgeBaseList(botId);

    setCurrentBotKnowledgeBase(knowledge);
  };

  const getBotById = async () => {
    if (!botId || !address) {
      setCurrentBotSettings(null);
      return;
    }

    const token = getToken();

    if (!token) {
      setCurrentBotSettings(null);
      console.warn('Token not found');
      return;
    }

    const bot = await fetchBot(botId);

    setCurrentBotSettings(bot);
  };

  const fetchBotsList = async (force?: boolean) => {
    if (!address) {
      setFetchingBots(false);
      return;
    }

    const token = getToken();

    if (!token) {
      setBots(null);
      setFetchingBots(false);
      console.warn('Token not found');
      return;
    }

    if (!force && bots) return;

    setFetchingBots(true);

    // @ts-ignore
    const botsList = await fetchUserBotsList((e: unknown) => toast.error(e.response?.data?.error));

    setBots(botsList);
    setFetchingBots(false);
  };

  return (
    <BotsProviderCtx.Provider
      value={{
        bots,
        fetchingBots,
        fetchBotsList,
        fetchingCurrentBot,
        fetchBotInfo,
        currentBot: {
          settings: currentBotSettings,
          knowledgeBase: currentBotKnowledgeBase,
        },
      }}
    >
      {children || <Outlet />}
    </BotsProviderCtx.Provider>
  );
};

export const useBots = () => useContext(BotsProviderCtx);
