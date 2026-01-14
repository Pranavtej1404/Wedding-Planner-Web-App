package com.weddingplanner.algorithms.search;

import java.util.*;

/**
 * Trie (Prefix Tree) implementation for smart vendor search and autocomplete.
 */
public class TrieSearch {
    private final Node root;

    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        List<SearchResult> results = new ArrayList<>();
    }

    public static class SearchResult {
        public Long id;
        public String name;
        public String type; // VENDOR or SERVICE

        public SearchResult(Long id, String name, String type) {
            this.id = id;
            this.name = name;
            this.type = type;
        }
    }

    public TrieSearch() {
        this.root = new Node();
    }

    public void insert(String phrase, Long id, String type) {
        if (phrase == null || phrase.isEmpty())
            return;

        Node current = root;
        String lowerPhrase = phrase.toLowerCase();
        SearchResult result = new SearchResult(id, phrase, type);

        for (char c : lowerPhrase.toCharArray()) {
            current.children.putIfAbsent(c, new Node());
            current = current.children.get(c);

            // Limit stored results per node to keep memory efficient
            if (current.results.size() < 10) {
                current.results.add(result);
            }
        }
    }

    public List<SearchResult> getSuggestions(String prefix) {
        if (prefix == null || prefix.isEmpty())
            return Collections.emptyList();

        Node current = root;
        String lowerPrefix = prefix.toLowerCase();

        for (char c : lowerPrefix.toCharArray()) {
            current = current.children.get(c);
            if (current == null)
                return Collections.emptyList();
        }

        return new ArrayList<>(current.results);
    }
}
