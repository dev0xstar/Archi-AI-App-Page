import { Icon } from '@iconify/react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmailLogo from 'src/assets/images/email-logo.svg?react';
import TGLogo from 'src/assets/images/tg-logo.svg?react';
import UserIcon from 'src/assets/images/user-avatar.png';
import XLogo from 'src/assets/images/x-logo.svg?react';
import { CircleWithIcon } from 'src/components/UI/CircleWithIcon';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { SectionSubTitle } from 'src/components/UI/SectionSubTitle';
import { SectionTitle } from 'src/components/UI/SectionTitle';
import { Tooltip } from 'src/components/UI/Tooltip';
import { UIButton } from 'src/components/UI/UIButton';
import { EMAIL_LINK, TELEGRAM_LINK, TWITTER_TEXT } from 'src/constants/affiliate';
import { useAffiliateApi } from 'src/hooks/useAffiliateApi';
import { useSetModal } from 'src/providers/ModalsProvider';
import {
  ReferralLinkType,
  ReferralUserInfo,
  RefUserPaymentHistoryItem,
  RefUserStats,
} from 'src/types/affiliate';
import { Nullable } from 'src/types/objectHelpers';
import { getDisplayAmount } from 'src/utils/bigNumber';
import { shortenHash } from 'src/utils/ui';

const SHARE_BUTTONS = [
  {
    id: 'x',
    icon: <XLogo />,
  },
  {
    id: 'tg',
    icon: <TGLogo />,
  },
  {
    id: 'mail',
    icon: <EmailLogo />,
  },
];

export const AffiliateProgram = () => {
  const { fetchReferralLink, fetchUserPaymentHistory, fetchUserStats, fetchUserInfo } =
    useAffiliateApi();
  const setModal = useSetModal();
  const { address } = useWeb3ModalAccount();

  const [partnerRefLink, setPartnerRefLink] = useState('');
  const [userRefLink, setUserRefLink] = useState('');
  const [userStats, setUserStats] = useState<Nullable<RefUserStats>>(null);
  const [userInfo, setUserInfo] = useState<Nullable<ReferralUserInfo>>(null);
  const [userPaymentHistory, setUserPaymentHistory] =
    useState<Nullable<RefUserPaymentHistoryItem[]>>(null);
  const [fetchingStats, setFetchingStats] = useState(true);

  const twitterLink = (refLink: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(TWITTER_TEXT + refLink)}`;
  const telegramLink = (refLink: string) =>
    `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(
      TELEGRAM_LINK,
    )}`;

  const emailLinkRaw = (refLink: string) => {
    const emailLinkObj = { ...EMAIL_LINK };
    emailLinkObj.body = emailLinkObj.body.replace('[ReferralLink]', refLink);

    return `mailto:?subject=${encodeURIComponent(emailLinkObj.subject)}&body=${emailLinkObj.body}`;
  };

  useEffect(() => {
    if (!address) return;

    setFetchingStats(true);

    Promise.all([
      getUserInfo(),
      getUserStats(),
      getUserPaymentHistory(),
      createUserRefLink(),
      createPartnerRefLink(),
    ]).then(() => setFetchingStats(false));
  }, [address]);

  useEffect(() => {
    if (userInfo) setModal(null);
  }, [userInfo]);

  async function getUserInfo() {
    const info = await fetchUserInfo();

    setUserInfo(info);
  }

  async function getUserStats() {
    const stats = await fetchUserStats();

    setUserStats(stats);
  }

  async function getUserPaymentHistory() {
    const history = await fetchUserPaymentHistory();

    setUserPaymentHistory(history);
  }

  async function createUserRefLink() {
    const linkParams = await fetchReferralLink('user');

    if (!linkParams) return;

    setUserRefLink(
      `https://aigentx.xyz/affiliate-program?ref-type=user&ref-code=${linkParams.referral_code}`,
    );
  }

  async function createPartnerRefLink() {
    const linkParams = await fetchReferralLink('partner');

    if (!linkParams) return;

    setPartnerRefLink(
      `https://aigentx.xyz/affiliate-program?ref-type=partner&code=${linkParams.referral_code}`,
    );
  }

  const handleCopy = async (type: ReferralLinkType) => {
    if (type === 'user') await navigator.clipboard.writeText(userRefLink);
    else await navigator.clipboard.writeText(partnerRefLink);

    toast.success('Link coped');
  };

  function handleJoinAffiliate() {
    setModal({
      key: 'join-affiliate',
      title: 'Apply for Affiliate Program \n' + 'to Boost Your Earnings',
      onConfirm: async () => {
        await getUserInfo();
      },
    });
  }

  if (fetchingStats) return <LoadingStub label="Loading stats..." containerSize="full" />;

  return (
    <>
      <SectionTitle>Affiliate Program</SectionTitle>
      <SectionSubTitle>
        Build Your Team, Grow Your Business: Join Our Affiliate Program and Earn by Empowering Your
        Network!
      </SectionSubTitle>
      <div className="flex flex-col space-y-6">
        <OpacityBox className="rounded-3xl bg-[length:auto_100%] bg-right-top bg-no-repeat bg-[url('/images/affiliate-program-bg.png')]">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="block opacity-40">Invite Client</span>
              <Tooltip
                text={
                  <p>
                    Use this link to introduce new clients to our AI solutions. For each client's
                    purchase, you receive a 20% commission. For detailed guidance on it, check out{' '}
                    <a
                      className="text-purple-600 underline"
                      href="https://docs.aigentx.xyz/products-overview/aigentx-webapp/affiliate-program/invite-clients-referrals"
                      target="_blank"
                    >
                      our docs.
                    </a>
                  </p>
                }
              />
            </div>
            <div className="flex items-center">
              <div className="mr-2 relative flex-1 max-w-md">
                <input
                  value={userRefLink}
                  type="text"
                  placeholder="0"
                  className="w-full pl-3 pr-14 py-3.5 border rounded-lg text-lg text-white focus:ring-purple-500 focus:border-purple-500 bg-transparent"
                  disabled
                />
                <Icon
                  className="font-bold text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                  onClick={() => handleCopy('user')}
                  icon="fa6-solid:clone"
                />
              </div>
              {SHARE_BUTTONS.map((el) => (
                <a
                  key={el.id}
                  href={
                    el.id === 'x'
                      ? twitterLink(userRefLink)
                      : el.id === 'tg'
                        ? telegramLink(userRefLink)
                        : emailLinkRaw(userRefLink)
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <OpacityBox className="ml-2 cursor-pointer rounded-full p-0 w-11 h-11 bg-opacity-10 flex items-center justify-center">
                    {el.icon}
                  </OpacityBox>
                </a>
              ))}
            </div>
          </div>
          {userInfo && (
            <div className="mb-6">
              <div className="flex mb-2 items-center">
                <span className="block opacity-40">Invite Partner</span>{' '}
                <Tooltip
                  text={
                    <p>
                      Share this link to grow your affiliate team. Benefit from sales across 3
                      referral levels: 20% from direct recruits, 10% from their invites, and 7.5%
                      from third-level affiliates. For detailed guidance on it, check out{' '}
                      <a
                        className="text-purple-600 underline"
                        href="https://docs.aigentx.xyz/products-overview/aigentx-webapp/affiliate-program/invite-partners-affiliates"
                        target="_blank"
                      >
                        our docs.
                      </a>
                    </p>
                  }
                />
              </div>
              <div className="flex items-center mb-11">
                <div className="mr-2 relative flex-1 max-w-md">
                  <input
                    value={partnerRefLink}
                    type="text"
                    placeholder="0"
                    className="w-full pl-3 pr-14 py-3.5 border rounded-lg text-lg text-white focus:ring-purple-500 focus:border-purple-500 bg-transparent"
                    disabled
                  />
                  <Icon
                    className="font-bold text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                    onClick={() => handleCopy('partner')}
                    icon="fa6-solid:clone"
                  />
                </div>
                {SHARE_BUTTONS.map((el) => (
                  <a
                    key={el.id}
                    href={
                      el.id === 'x'
                        ? twitterLink(partnerRefLink)
                        : el.id === 'tg'
                          ? telegramLink(partnerRefLink)
                          : emailLinkRaw(partnerRefLink)
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <OpacityBox
                      key={el.id}
                      className="ml-2 cursor-pointer rounded-full p-0 w-11 h-11 bg-opacity-10 flex items-center justify-center"
                    >
                      {el.icon}
                    </OpacityBox>
                  </a>
                ))}
              </div>
            </div>
          )}
          {!userInfo && (
            <UIButton className="mt-6" onClick={handleJoinAffiliate}>
              Join Affiliate Program
            </UIButton>
          )}
        </OpacityBox>
        <OpacityBox className="flex justify-between">
          <span className="text-2xl">
            Your client
            <br />
            affiliate stats
          </span>
          <div className="flex">
            <OpacityBox className="ml-4 p-4 flex rounded-2xl">
              <CircleWithIcon icon={<Icon icon="fa6-solid:basket-shopping" />} />
              <div className="flex flex-col ml-4">
                <span className="text-base opacity-40">Sales amount</span>
                <span className="text-xl">{userStats?.sales_amount || '0'}</span>
                <span className="opacity-40">{userStats?.sales_number || '0'} Sales</span>
              </div>
            </OpacityBox>
            <OpacityBox className="ml-4 p-4 flex rounded-2xl">
              <CircleWithIcon icon={<Icon icon="fa6-solid:user-group" />} />
              <div className="flex flex-col ml-4">
                <span className="text-base opacity-40">Partner Income</span>
                <span className="text-xl">{userStats?.partner_income || '0'}</span>
                <span className="opacity-40">{userStats?.partners_number || '0'} Partners</span>
              </div>
            </OpacityBox>
          </div>
        </OpacityBox>

        <OpacityBox className="overflow-x-auto">
          {userPaymentHistory ? (
            <>
              <div className="flex mb-2 px-4">
                <div className="w-1/4">Client</div>
                <div className="w-1/4">Date</div>
                <div className="w-1/4">Partner</div>
                <div className="w-1/4">Income</div>
              </div>
              <div className="flex flex-col">
                {userPaymentHistory.length === 0 ? (
                  <p className="text-center mb-4 mt-8">No income to show </p>
                ) : (
                  userPaymentHistory.map((el) => (
                    <div
                      key={el.id}
                      className="flex items-center rounded-xl p-4 odd:bg-white odd:bg-opacity-5"
                    >
                      <div className="flex items-center space-x-3 w-1/4">
                        <img className="w-6 h-6 rounded-full" src={UserIcon} alt="User Avatar" />
                        <div className="text-white">User name</div>
                        <div className="text-xs text-gray-500 bg-white bg-opacity-5 px-2 py-1 pb-0.5 rounded-md">
                          {el.event_type}
                        </div>
                      </div>
                      <div className="w-1/4">{moment(el.created_at).format('DD.MM.YYYY')}</div>
                      <div className="w-1/4">{shortenHash(el.wallet)}</div>
                      <div className="w-1/4">
                        {getDisplayAmount(el.amount, { decimals: 18, round: 6 })} ETH
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : null}
        </OpacityBox>
      </div>
    </>
  );
};
