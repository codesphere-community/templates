package com.example.demo;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import com.rometools.rome.feed.synd.SyndCategory;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.time.ZoneId;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GhostRssService {

    private final String ghostRssFeedUrl = "https://codesphere.ghost.io/rss/";
    private static final Logger logger = LoggerFactory.getLogger(GhostRssService.class);

    public List<BlogPost> getLatestBlogPosts(int count) {
        List<BlogPost> blogPosts = new ArrayList<>();
        try {
            URL feedUrl = new URL(ghostRssFeedUrl);
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(feedUrl));
            List<SyndEntry> entries = feed.getEntries(); // Add this line to retrieve entries
            logger.info("RSS Feed fetched successfully with {} entries", entries.size());
            for (int i = 0; i < count && i < entries.size(); i++) {
                SyndEntry entry = entries.get(i);
                BlogPost blogPost = new BlogPost();
                blogPost.setTitle(entry.getTitle());
                blogPost.setLink(entry.getLink());
                blogPost.setDescription(entry.getDescription().getValue());
                List<SyndCategory> categories = entry.getCategories();
                if (categories != null && !categories.isEmpty()) {
                    SyndCategory primaryCategory = categories.get(0); // Get the first tag
                    blogPost.setCategory(primaryCategory.getName());
                }
                blogPost.setSlug(extractPostSlugFromLink(entry.getLink()));
                blogPost.setPublishedDate(entry.getPublishedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                blogPosts.add(blogPost);
            }
        } catch (Exception e) {
            logger.error("Error fetching or parsing RSS feed: {}", e.getMessage());
            e.printStackTrace();
            // Handle the exception appropriately
        }
        return blogPosts;
    }
    private String extractPostSlugFromLink(String link) {
        // Logic to extract the post slug from the link
        if (link.endsWith("/")) {
            link = link.substring(0, link.length() - 1);
        }
        int lastSlashIndex = link.lastIndexOf('/');
        return link.substring(lastSlashIndex);
    }
}
