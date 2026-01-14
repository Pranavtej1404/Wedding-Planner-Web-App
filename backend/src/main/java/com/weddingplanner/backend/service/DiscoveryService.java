package com.weddingplanner.backend.service;

import com.weddingplanner.algorithms.recommendation.VendorGraph;
import com.weddingplanner.algorithms.search.TrieSearch;
import com.weddingplanner.backend.model.Vendor;
import com.weddingplanner.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscoveryService {

    @Autowired
    private VendorRepository vendorRepository;

    private TrieSearch trieSearch = new TrieSearch();
    private VendorGraph vendorGraph = new VendorGraph();

    @PostConstruct
    public void init() {
        refreshData();
    }

    public void refreshData() {
        List<Vendor> vendors = vendorRepository.findAll();

        // Reset
        trieSearch = new TrieSearch();
        vendorGraph = new VendorGraph();

        for (Vendor v : vendors) {
            // Index for search
            trieSearch.insert(v.getBusinessName(), v.getId(), "VENDOR");
            trieSearch.insert(v.getCategory(), v.getId(), "CATEGORY");

            // Add to graph
            vendorGraph.addVendor(v.getId());
        }

        // Build edges based on category similarity (simplified version)
        for (int i = 0; i < vendors.size(); i++) {
            for (int j = i + 1; j < vendors.size(); j++) {
                Vendor v1 = vendors.get(i);
                Vendor v2 = vendors.get(j);

                if (v1.getCategory().equals(v2.getCategory())) {
                    // High similarity if same category
                    vendorGraph.addSimilarity(v1.getId(), v2.getId(), 1.0);
                } else {
                    // Lower similarity for different categories (placeholder logic)
                    vendorGraph.addSimilarity(v1.getId(), v2.getId(), 5.0);
                }
            }
        }
    }

    public List<TrieSearch.SearchResult> search(String query) {
        return trieSearch.getSuggestions(query);
    }

    public List<Vendor> getRecommendations(Long vendorId, int k) {
        List<Long> recommendedIds = vendorGraph.getRecommendations(vendorId, k);
        return recommendedIds.stream()
                .map(id -> vendorRepository.findById(id).orElse(null))
                .filter(v -> v != null)
                .collect(Collectors.toList());
    }
}
