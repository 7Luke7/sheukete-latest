import { onCleanup } from "solid-js"
import { get_messages } from "~/routes/api/messages/main"

export class createVirtualizer {
    constructor(scrollerRef, virtualStore, setLoading, setVirtualStore, wrapper, conversation_id, limit = 20) {
        this.scroller = scrollerRef
        this.virtualStore = virtualStore
        this.setVirtualStore = setVirtualStore
        this.store_keys = Object.keys(this.virtualStore)
        this.wrapper = wrapper
        this.setLoading = setLoading
        this.node_pointer = new Map()
        this.count_outing = 0
        this.conversation_id = conversation_id
        this.limit = limit
        this.previousNodeHieght = 0
        this.has_reached_end = false
        // comeback to this later
        this.observer_callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const entry_node = entry.target
                    const last_node_id = entry_node.getAttribute(`checkpoint-${this.node_pointer.size}`)
                    const nodes = this.node_pointer.get(last_node_id)?.vm_messages
                    nodes?.forEach((node) => {
                        this.wrapper.insertBefore(node, entry_node)
                    })
                    observer.unobserve(entry_node)
                    this.wrapper.removeChild(entry_node)
                    this.node_pointer.delete(last_node_id)
                }
            })
        };
        this.observer = new IntersectionObserver(this.observer_callback, { root: this.scroller, rootMargin: "0px", threshold: 1.0 })
        onCleanup(() => this.observer?.disconnect())
    }

    adjust_scroll(prev_content_height) {
        requestAnimationFrame(() => {
            const addedHeight = (this.scroller.scrollHeight - prev_content_height) + this.previousNodeHieght;
            this.scroller.scrollTop += addedHeight;
        });
    }

    async virtualize(scrollTop, contentHeight, offsetHeight) {
        if (scrollTop === 0 && !this.has_reached_end) {
            this.setLoading(true)
            const { message_id, created_at } = this.virtualStore.messages[0];
            const response = await get_messages(this.conversation_id, { message_id, created_at });
            if (!response.convos.length) {
                this.has_reached_end = true
                return this.setLoading(false) // could show a toast indicating that messages couldn't load or similar
            }
            this.previousNodeHieght = 0
            this.count_outing++;
            this.setVirtualStore("messages", (messages) => [...response.convos, ...messages]);
            this.adjust_scroll(contentHeight)

            if (this.count_outing % 2 === 0) {
                this.create_virtual_nodes_bottom(contentHeight);
            }
            this.setLoading(false)
        }
    }

    create_virtual_nodes_bottom() {
        const all_children = Array.from(this.wrapper.children);
        const virtualization_target = all_children.reverse().slice(this.node_pointer.size, this.limit + this.node_pointer.size);
        const last_node_id = virtualization_target[virtualization_target.length - 1]?.getAttribute("last-message-id");

        if (!last_node_id) return;

        const total_node_height = virtualization_target.reduce((acc, node) => {
            return acc + node.offsetHeight
        }, 0)

        this.previousNodeHieght = total_node_height
        const placeholder = document.createElement("div");
        placeholder.setAttribute(`checkpoint-${this.node_pointer.size + 1}`, last_node_id);
        placeholder.innerHTML = "&nbsp;";
        placeholder.style.pointerEvents = "none";

        this.node_pointer.set(last_node_id, {
            vm_messages: virtualization_target.reverse(),
            placeholder
        });

        virtualization_target.forEach((node) => {
            this.wrapper.removeChild(node);
        });

        if (this.node_pointer.size > 1) {
            const last_pointer = Array.from(this.node_pointer.keys())?.reverse().pop()
            const previous_checkpoint = this.node_pointer.get(last_pointer)
            this.wrapper.insertBefore(placeholder, previous_checkpoint.placeholder)
        } else {
            this.wrapper.appendChild(placeholder)
        }
        this.observer.observe(placeholder)
    }


    render() {
        let timeoutId
        const scrollEvent = (event) => new Promise((res, rej) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                this.virtualize(event.target.scrollTop, event.target.scrollHeight, event.target.offsetHeight)
            }, 100)
            res()
        }).then(() => this.scroller.removeEventListener("scroll", scrollEvent))
            .finally(() => this.scroller.addEventListener("scroll", scrollEvent))

        this.scroller.addEventListener("scroll", scrollEvent)
    }
}