package com.example.demo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;


@Controller
public class IndexController {

    private final GhostRssService ghostRssService;

    @Autowired
    public IndexController(GhostRssService ghostRssService) {
        this.ghostRssService = ghostRssService;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<BlogPost> blogPosts = ghostRssService.getLatestBlogPosts(6);
        model.addAttribute("blogPosts", blogPosts);
        return "index";
    }
}
