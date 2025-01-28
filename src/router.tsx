import React from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { NetworkAttention } from 'src/components/NetworkAttention';
import { PleaseSignInGuard } from 'src/components/PleaseSignInGuard';
import { ReferralWatcher } from 'src/components/ReferralWatcher';
import { AffiliateProgram } from 'src/pages/affiliate-program';
import { Conversations } from 'src/pages/conversations/conversations';
import { Dashboard } from 'src/pages/dashboard/dashboard';
import { KnowledgeBaseId } from 'src/pages/my-bots/[botId]/[knowledgeBaseId]/knowledgeBaseId';
import { BotId } from 'src/pages/my-bots/[botId]/botId';
import { MyBots } from 'src/pages/my-bots/my-bots';
import { NewBot } from 'src/pages/my-bots/new-bot/new-bot';
import { NotFound } from 'src/pages/not-found';
import { Pricing } from 'src/pages/pricing/pricing';
import { Staking } from 'src/pages/staking';
import { BotsProvider } from 'src/providers/BotsProvider';
import { StakesProvider } from 'src/providers/StakesProvider';
import { MainLayout } from './layout/MainLayout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <>
        <ReferralWatcher />
        <MainLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/staking" replace />,
      },
      {
        path: 'conversations',
        children: [
          {
            index: true,
            element: <Conversations />,
          },
        ],
      },
      {
        path: 'dashboard',
        element: (
          <PleaseSignInGuard>
            <BotsProvider>
              <Dashboard />
            </BotsProvider>
          </PleaseSignInGuard>
        ),
      },
      {
        path: 'staking',
        element: (
          <StakesProvider>
            <NetworkAttention />
            <Staking />
          </StakesProvider>
        ),
      },
      {
        path: 'affiliate-program',
        element: (
          <PleaseSignInGuard>
            <AffiliateProgram />
          </PleaseSignInGuard>
        ),
      },
      {
        path: 'product-suite',
        element: (
          <PleaseSignInGuard>
            <NetworkAttention />
            <Pricing />
          </PleaseSignInGuard>
        ),
      },
      {
        path: 'my-bots',
        element: (
          <PleaseSignInGuard>
            <BotsProvider />
          </PleaseSignInGuard>
        ),
        children: [
          {
            index: true,
            element: <MyBots />,
          },
          {
            path: 'new-bot',
            element: <NewBot />,
          },
          {
            path: ':botId',
            children: [
              {
                index: true,
                element: <BotId />,
              },
              {
                path: ':knowledgeBaseId',
                element: <KnowledgeBaseId />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />, // A component to display when no routes match
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
