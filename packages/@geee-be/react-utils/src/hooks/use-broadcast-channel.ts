'use client';

import { useCallback, useEffect, useMemo } from 'react';

/**
 * React hook to create and manage a Broadcast Channel across multiple browser windows.
 *
 * @param channelName Static name of channel used across the browser windows.
 * @param handleMessage Callback to handle the event generated when `message` is received.
 * @param handleMessageError [optional] Callback to handle the event generated when `error` is received.
 * @returns A function to send/post message on the channel.
 * @example
 * ```tsx
 * import {useBroadcastChannel} from 'react-broadcast-channel';
 *
 * function App () {
 *   const postUserIdMessage = useBroadcastChannel('userId', (e) => alert(e.data));
 *   return (<button onClick={() => postUserIdMessage('ABC123')}>Send UserId</button>);
 * }
 * ```
 * ---
 * Works in browser that support Broadcast Channel API natively. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API#browser_compatibility).
 * To support other browsers, install and use [broadcastchannel-polyfill](https://www.npmjs.com/package/broadcastchannel-polyfill).
 */
export const useBroadcastChannel = <T = string>(
  channelName: string,
  handleMessage?: (event: MessageEvent) => void,
  handleMessageError?: (event: MessageEvent) => void,
): ((data: T) => void) => {
  const channel = useMemo(
    () =>
      typeof window !== 'undefined' && 'BroadcastChannel' in window
        ? new BroadcastChannel(`${channelName}-channel`)
        : null,
    [channelName],
  );

  useChannelEventListener(channel, 'message', handleMessage);
  useChannelEventListener(channel, 'messageerror', handleMessageError);

  useEffect(() => () => channel?.close(), [channel]);

  return useCallback(
    (data: T) => {
      channel?.postMessage(data);
    },
    [channel],
  );
};

// Helpers

/** Hook to subscribe/unsubscribe from channel events. */
const useChannelEventListener = <K extends keyof BroadcastChannelEventMap>(
  channel: BroadcastChannel | null,
  event: K,
  handler: (e: BroadcastChannelEventMap[K]) => void = () => {},
): void => {
  useEffect(() => {
    if (!channel) return;

    channel.addEventListener(event, handler);
    return () => channel.removeEventListener(event, handler);
  }, [channel, event, handler]);
};
