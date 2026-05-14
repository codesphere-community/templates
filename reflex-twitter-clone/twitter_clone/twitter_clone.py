import reflex as rx


class State(rx.State):
    current_user: str = "Ada"
    current_handle: str = "@ada.codes"
    draft: str = ""
    signed_in: bool = False
    posts: list[dict[str, str | int | bool]] = [
        {
            "id": 1,
            "author": "Mira",
            "handle": "@mira.builds",
            "avatar": "M",
            "body": "Reflex makes this whole social feed feel surprisingly Python-native.",
            "timestamp": "8m",
            "likes": 18,
            "reposts": 4,
            "liked": False,
            "reposted": False,
        },
        {
            "id": 2,
            "author": "Jon",
            "handle": "@jon.codes",
            "avatar": "J",
            "body": "Shipping a template is easier when the deploy script is part of the repo, not hidden in a wiki.",
            "timestamp": "22m",
            "likes": 31,
            "reposts": 7,
            "liked": False,
            "reposted": False,
        },
        {
            "id": 3,
            "author": "Leah",
            "handle": "@leah.ops",
            "avatar": "L",
            "body": "Next step: wire this to SQLite and turn demo posts into real conversations.",
            "timestamp": "1h",
            "likes": 12,
            "reposts": 2,
            "liked": False,
            "reposted": False,
        },
    ]

    @rx.event
    def update_draft(self, value: str):
        self.draft = value

    @rx.event
    def sign_in(self):
        self.signed_in = True

    @rx.event
    def sign_out(self):
        self.signed_in = False

    @rx.event
    def publish(self):
        text = self.draft.strip()
        if not text or not self.signed_in:
            return
        self.posts.insert(
            0,
            {
                "id": max([int(post["id"]) for post in self.posts], default=0) + 1,
                "author": self.current_user,
                "handle": self.current_handle,
                "avatar": self.current_user[0],
                "body": text,
                "timestamp": "now",
                "likes": 0,
                "reposts": 0,
                "liked": False,
                "reposted": False,
            },
        )
        self.draft = ""

    @rx.event
    def toggle_like(self, post_id: int):
        for post in self.posts:
            if post["id"] == post_id:
                post["liked"] = not post["liked"]
                post["likes"] += 1 if post["liked"] else -1
                break

    @rx.event
    def toggle_repost(self, post_id: int):
        for post in self.posts:
            if post["id"] == post_id:
                post["reposted"] = not post["reposted"]
                post["reposts"] += 1 if post["reposted"] else -1
                break


def avatar(letter: str) -> rx.Component:
    return rx.center(
        rx.text(letter, font_weight="700", color="white"),
        width="44px",
        height="44px",
        border_radius="999px",
        background="#2563eb",
        flex_shrink="0",
    )


def sidebar() -> rx.Component:
    return rx.vstack(
        rx.heading("Reflex Social", size="6"),
        rx.button("Home", width="100%", variant="soft"),
        rx.button("Explore", width="100%", variant="ghost"),
        rx.button("Messages", width="100%", variant="ghost"),
        rx.button("Profile", width="100%", variant="ghost"),
        rx.spacer(),
        rx.cond(
            State.signed_in,
            rx.button("Sign out", on_click=State.sign_out, width="100%"),
            rx.button("Sign in demo", on_click=State.sign_in, width="100%"),
        ),
        align="stretch",
        min_width="190px",
        height="calc(100vh - 48px)",
        padding="24px 18px",
        border_right="1px solid #e5e7eb",
        position="sticky",
        top="0",
    )


def composer() -> rx.Component:
    return rx.vstack(
        rx.hstack(
            avatar("A"),
            rx.text_area(
                placeholder="What are you building?",
                value=State.draft,
                on_change=State.update_draft,
                min_height="96px",
                resize="vertical",
            ),
            width="100%",
            align="start",
        ),
        rx.hstack(
            rx.cond(
                State.signed_in,
                rx.text("Posting as @ada.codes", color="#64748b"),
                rx.text("Sign in to publish", color="#64748b"),
            ),
            rx.spacer(),
            rx.button("Post", on_click=State.publish, is_disabled=~State.signed_in),
            width="100%",
        ),
        padding="20px",
        border_bottom="1px solid #e5e7eb",
        align="stretch",
    )


def post_card(post: dict[str, str | int | bool]) -> rx.Component:
    return rx.hstack(
        avatar(post["avatar"]),
        rx.vstack(
            rx.hstack(
                rx.text(post["author"], font_weight="700"),
                rx.text(post["handle"], color="#64748b"),
                rx.text("·", color="#94a3b8"),
                rx.text(post["timestamp"], color="#64748b"),
                spacing="2",
            ),
            rx.text(post["body"], line_height="1.6"),
            rx.hstack(
                rx.button(
                    rx.cond(post["liked"], "Liked", "Like"),
                    rx.text(post["likes"]),
                    on_click=State.toggle_like(post["id"]),
                    variant=rx.cond(post["liked"], "solid", "soft"),
                ),
                rx.button(
                    rx.cond(post["reposted"], "Reposted", "Repost"),
                    rx.text(post["reposts"]),
                    on_click=State.toggle_repost(post["id"]),
                    variant=rx.cond(post["reposted"], "solid", "soft"),
                ),
                spacing="3",
                padding_top="8px",
            ),
            align="stretch",
            width="100%",
            spacing="2",
        ),
        align="start",
        padding="20px",
        border_bottom="1px solid #e5e7eb",
        width="100%",
    )


def trends() -> rx.Component:
    topics = ["#Reflex", "#PythonWeb", "#Codesphere", "#OpenSource"]
    return rx.vstack(
        rx.heading("Trends", size="4"),
        rx.foreach(
            topics,
            lambda topic: rx.box(
                rx.text(topic, font_weight="600"),
                rx.text("Template builders are talking", color="#64748b", font_size="14px"),
                padding="12px 0",
                border_bottom="1px solid #e5e7eb",
                width="100%",
            ),
        ),
        rx.box(
            rx.text("Demo profile", font_weight="700"),
            rx.text("@ada.codes", color="#64748b"),
            rx.text("Python-first product builder", margin_top="8px"),
            padding="16px",
            border="1px solid #e5e7eb",
            border_radius="8px",
            width="100%",
        ),
        align="stretch",
        min_width="240px",
        padding="24px 18px",
        position="sticky",
        top="0",
        height="calc(100vh - 48px)",
    )


def index() -> rx.Component:
    return rx.hstack(
        sidebar(),
        rx.vstack(
            rx.heading("Home", size="5", padding="20px", border_bottom="1px solid #e5e7eb", width="100%"),
            composer(),
            rx.foreach(State.posts, post_card),
            align="stretch",
            width="100%",
            max_width="680px",
            min_height="100vh",
        ),
        trends(),
        align="start",
        justify="center",
        width="100%",
        min_height="100vh",
        background="#ffffff",
        color="#0f172a",
    )


app = rx.App()
app.add_page(index, title="Reflex Twitter Clone")
