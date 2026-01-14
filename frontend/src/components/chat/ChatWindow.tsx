"use client";

import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Message {
    id?: number;
    chatRoomId: number;
    senderId: number;
    senderName: string;
    content: string;
    timestamp: string;
}

// Simple Min Heap for message ordering in TypeScript
class MinHeap<T> {
    private heap: T[] = [];
    constructor(private comparator: (a: T, b: T) => number) { }

    push(item: T) {
        this.heap.push(item);
        this.siftUp(this.heap.length - 1);
    }

    pop(): T | undefined {
        if (this.isEmpty()) return undefined;
        const root = this.heap[0];
        const last = this.heap.pop();
        if (!this.isEmpty() && last !== undefined) {
            this.heap[0] = last;
            this.siftDown(0);
        }
        return root;
    }

    private siftUp(index: number) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
            [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
            index = parent;
        }
    }

    private siftDown(index: number) {
        const half = Math.floor(this.heap.length / 2);
        while (index < half) {
            let left = 2 * index + 1;
            let right = left + 1;
            let smallest = left;
            if (right < this.heap.length && this.comparator(this.heap[right], this.heap[left]) < 0) {
                smallest = right;
            }
            if (this.comparator(this.heap[index], this.heap[smallest]) <= 0) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    isEmpty() { return this.heap.length === 0; }
    get items() { return [...this.heap].sort(this.comparator); }
}

interface ChatWindowProps {
    roomId: number;
    onClose: () => void;
}

export default function ChatWindow({ roomId, onClose }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const stompClient = useRef<Client | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch History
        api.get(`/chat/history/${roomId}`).then((res) => {
            setMessages(res.data);
        });

        // Initialize STOMP
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/../ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
                client.subscribe(`/topic/messages/${roomId}`, (msg) => {
                    const received: Message = JSON.parse(msg.body);
                    setMessages((prev) => {
                        // Use Min Heap logic to ensure unique and ordered
                        const all = [...prev, received];
                        const unique = Array.from(new Map(all.map(m => [m.id, m])).values());
                        return unique.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                    });
                });
            },
            onDisconnect: () => setConnected(false),
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !stompClient.current?.connected || !user) return;

        const msg: Message = {
            chatRoomId: roomId,
            senderId: user.id,
            senderName: user.name,
            content: input,
            timestamp: new Date().toISOString(),
        };

        stompClient.current.publish({
            destination: `/app/chat/${roomId}`,
            body: JSON.stringify(msg),
        });
        setInput("");
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-bold">Chat Support</h3>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`}></div>
                        <span className="text-xs text-slate-400">{connected ? "Online" : "Connecting..."}</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, idx) => (
                    <div key={m.id || idx} className={`flex flex-col ${m.senderId === user?.id ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.senderId === user?.id ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none"}`}>
                            {m.content}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">
                            {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={!connected}
                        className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
