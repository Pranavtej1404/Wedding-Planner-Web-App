package com.weddingplanner.algorithms.scheduling;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * High-performance Interval Tree for $O(\log N)$ conflict detection.
 * Augmented Binary Search Tree where each node stores:
 * - An interval [start, end]
 * - The maximum 'end' value in its subtree
 */
public class IntervalTree {

    private Node root;

    private static class Node {
        long low, high, max;
        Node left, right;

        Node(long low, long high) {
            this.low = low;
            this.high = high;
            this.max = high;
        }
    }

    public void insert(LocalDateTime start, LocalDateTime end) {
        long s = start.toEpochSecond(ZoneOffset.UTC);
        long e = end.toEpochSecond(ZoneOffset.UTC);
        root = insert(root, s, e);
    }

    private Node insert(Node node, long low, long high) {
        if (node == null)
            return new Node(low, high);

        if (low < node.low) {
            node.left = insert(node.left, low, high);
        } else {
            node.right = insert(node.right, low, high);
        }

        if (node.max < high) {
            node.max = high;
        }

        return node;
    }

    public boolean hasOverlap(LocalDateTime start, LocalDateTime end) {
        long s = start.toEpochSecond(ZoneOffset.UTC);
        long e = end.toEpochSecond(ZoneOffset.UTC);
        return findOverlapping(root, s, e) != null;
    }

    private Node findOverlapping(Node node, long low, long high) {
        if (node == null)
            return null;

        // Standard overlap condition: (low < node.high) && (node.low < high)
        if (low < node.high && node.low < high) {
            return node;
        }

        // If left child exists and its max is greater than our low, overlap might be in
        // left subtree
        if (node.left != null && node.left.max > low) {
            return findOverlapping(node.left, low, high);
        }

        // Otherwise, search right subtree
        return findOverlapping(node.right, low, high);
    }

    /**
     * Compatibility bridge for existing code.
     */
    public static boolean checkConflicts(LocalDateTime start, LocalDateTime end,
            List<BookingInterval> existingBookings) {
        IntervalTree tree = new IntervalTree();
        for (BookingInterval existing : existingBookings) {
            tree.insert(existing.getStart(), existing.getEnd());
        }
        return tree.hasOverlap(start, end);
    }

    public static class BookingInterval {
        private LocalDateTime start;
        private LocalDateTime end;

        public BookingInterval(LocalDateTime start, LocalDateTime end) {
            this.start = start;
            this.end = end;
        }

        public LocalDateTime getStart() {
            return start;
        }

        public LocalDateTime getEnd() {
            return end;
        }
    }
}
