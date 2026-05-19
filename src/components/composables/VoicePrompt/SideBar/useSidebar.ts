

import { ref, computed } from 'vue'
import { chatType } from "@/types/chat";

export const useSidebar = () => {

    const isCollapsed = ref(false)



    const toggleSidebar = () => {
        isCollapsed.value = !isCollapsed.value
    }

    const chats = ref<chatType[]>([
        { id: 1, title: 'Typo Assistance Request' },
        { id: 2, title: 'Quadratic Function Plot' },
        { id: 3, title: 'Toyota Names Poetry' }
    ])



    const createNewChat = () => {
        chats.value.unshift({ id: Math.random(), title: 'New chat' })
    }

    return {
        isCollapsed,
        toggleSidebar,
        chats,
        createNewChat
    }



}