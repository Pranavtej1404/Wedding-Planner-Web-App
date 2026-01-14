package com.weddingplanner.backend.controller;

import com.weddingplanner.algorithms.search.TrieSearch;
import com.weddingplanner.backend.model.Vendor;
import com.weddingplanner.backend.service.DiscoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discovery")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SearchController {

    @Autowired
    private DiscoveryService discoveryService;

    @GetMapping("/search")
    public List<TrieSearch.SearchResult> search(@RequestParam String q) {
        return discoveryService.search(q);
    }

    @GetMapping("/recommendations/{vendorId}")
    public List<Vendor> getRecommendations(@PathVariable Long vendorId, @RequestParam(defaultValue = "4") int k) {
        return discoveryService.getRecommendations(vendorId, k);
    }

    @PostMapping("/refresh")
    public String refresh() {
        discoveryService.refreshData();
        return "Data refreshed";
    }
}
