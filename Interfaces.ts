import React from "react";

export interface CHAT {
    id: string
    title: string
    profiles: [any]
    members: any
    user: {
        id: string
        name: string
        profiles: [any]
    }
    lastMessage: {
        text: string
        sentAt: number
    }

}