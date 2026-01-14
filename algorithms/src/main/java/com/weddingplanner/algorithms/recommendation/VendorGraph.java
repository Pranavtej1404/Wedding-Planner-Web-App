package com.weddingplanner.algorithms.recommendation;

import java.util.*;

/**
 * Graph-based recommendation engine using Dijkstra's algorithm.
 * Nodes represent vendors, and edges represent "similarity" weights.
 */
public class VendorGraph {
    private final Map<Long, List<Edge>> adjacencyList = new HashMap<>();

    private static class Edge {
        Long to;
        double weight;

        Edge(Long to, double weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    public void addVendor(Long vendorId) {
        adjacencyList.putIfAbsent(vendorId, new ArrayList<>());
    }

    public void addSimilarity(Long v1, Long v2, double weight) {
        addVendor(v1);
        addVendor(v2);
        adjacencyList.get(v1).add(new Edge(v2, weight));
        adjacencyList.get(v2).add(new Edge(v1, weight));
    }

    public List<Long> getRecommendations(Long startId, int k) {
        if (!adjacencyList.containsKey(startId))
            return Collections.emptyList();

        Map<Long, Double> distances = new HashMap<>();
        PriorityQueue<Long> pq = new PriorityQueue<>(Comparator.comparingDouble(distances::get));

        for (Long id : adjacencyList.keySet()) {
            distances.put(id, Double.MAX_VALUE);
        }

        distances.put(startId, 0.0);
        pq.add(startId);

        List<Long> result = new ArrayList<>();
        Set<Long> visited = new HashSet<>();

        while (!pq.isEmpty() && result.size() < k + 1) {
            Long current = pq.poll();
            if (!visited.add(current))
                continue;

            if (!current.equals(startId)) {
                result.add(current);
            }

            for (Edge edge : adjacencyList.get(current)) {
                double newDist = distances.get(current) + edge.weight;
                if (newDist < distances.get(edge.to)) {
                    distances.put(edge.to, newDist);
                    pq.add(edge.to);
                }
            }
        }

        return result;
    }
}
