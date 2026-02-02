package com.weddingplanner.algorithms.analytics;

/**
 * Prefix Sum implementation for sub-second historical range queries.
 * Pre-computes cumulative sums in O(N).
 * Range queries take O(1).
 */
public class PrefixSum {
    private final double[] prefixSums;

    public PrefixSum(double[] data) {
        prefixSums = new double[data.length + 1];
        prefixSums[0] = 0;
        for (int i = 0; i < data.length; i++) {
            prefixSums[i + 1] = prefixSums[i] + data[i];
        }
    }

    /**
     * Get sum in range [left, right] inclusive.
     */
    public double getRangeSum(int left, int right) {
        if (left < 0 || right >= prefixSums.length - 1 || left > right) {
            return 0;
        }
        return prefixSums[right + 1] - prefixSums[left];
    }
}
