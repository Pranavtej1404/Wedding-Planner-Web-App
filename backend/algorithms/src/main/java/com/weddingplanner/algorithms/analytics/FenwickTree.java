package com.weddingplanner.algorithms.analytics;

/**
 * Fenwick Tree (Binary Indexed Tree) for dynamic range sum queries.
 * Point updates take O(log N).
 * Prefix sum queries take O(log N).
 */
public class FenwickTree {
    private final double[] tree;

    public FenwickTree(int size) {
        this.tree = new double[size + 1];
    }

    public void update(int index, double delta) {
        index++; // 1-based indexing for BIT
        while (index < tree.length) {
            tree[index] += delta;
            index += index & (-index);
        }
    }

    public double query(int index) {
        index++; // 1-based indexing for BIT
        double sum = 0;
        while (index > 0) {
            sum += tree[index];
            index -= index & (-index);
        }
        return sum;
    }

    public double queryRange(int left, int right) {
        if (left < 0 || right >= tree.length - 1 || left > right) {
            return 0;
        }
        return query(right) - query(left - 1);
    }
}
