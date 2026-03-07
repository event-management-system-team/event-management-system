import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { message } from 'antd';

export const useCheckInWebSocket = (eventSlug) => {
    const queryClient = useQueryClient();
    const clientRef = useRef(null);

    useEffect(() => {
        if (!eventSlug) return;

        const SOCKET_URL = import.meta.env.VITE_WS_URL;

        const client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {

                client.subscribe(`/topic/event/${eventSlug}/checkin`, (payload) => {
                    if (payload.body) {

                        setTimeout(() => {
                            queryClient.invalidateQueries({
                                predicate: (query) => query.queryKey[0] === 'event' && query.queryKey[1] === 'tickets'
                            });
                        }, 500);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketError: (event) => {
                console.error("WebSocket Error:", event);
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [eventSlug, queryClient]);
};