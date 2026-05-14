import reflex as rx
from reflex_base.plugins import SitemapPlugin
from reflex_components_radix.plugin import RadixThemesPlugin


config = rx.Config(
    app_name="twitter_clone",
    plugins=[RadixThemesPlugin()],
    disable_plugins=[SitemapPlugin],
)
