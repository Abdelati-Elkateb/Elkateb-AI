
import { defineStore } from "pinia";


export default {
    state: () => ({
        chats: [],
    }),

    actions: {
        addChat(chat) {
            this.chats.push(chat);
        }

}
}