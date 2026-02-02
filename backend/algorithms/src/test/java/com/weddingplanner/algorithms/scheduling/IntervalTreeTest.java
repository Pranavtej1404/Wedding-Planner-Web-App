package com.weddingplanner.algorithms.scheduling;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class IntervalTreeTest {

    @Test
    public void testOverlapDetection() {
        IntervalTree tree = new IntervalTree();
        LocalDateTime base = LocalDateTime.of(2026, 1, 1, 10, 0);

        // [10:00 - 12:00]
        tree.insert(base, base.plusHours(2));

        // Exact overlap
        assertTrue(tree.hasOverlap(base, base.plusHours(2)));

        // Partial overlap (start inside)
        assertTrue(tree.hasOverlap(base.plusHours(1), base.plusHours(3)));

        // Partial overlap (end inside)
        assertTrue(tree.hasOverlap(base.minusHours(1), base.plusHours(1)));

        // Encompassing overlap
        assertTrue(tree.hasOverlap(base.minusHours(1), base.plusHours(3)));

        // No overlap (before)
        assertFalse(tree.hasOverlap(base.minusHours(3), base.minusHours(1)));

        // No overlap (after)
        assertFalse(tree.hasOverlap(base.plusHours(3), base.plusHours(5)));

        // Edge case: Touching but not overlapping (Standard interval rule)
        assertFalse(tree.hasOverlap(base.minusHours(2), base));
        assertFalse(tree.hasOverlap(base.plusHours(2), base.plusHours(4)));
    }

    @Test
    public void testMultipleIntervals() {
        IntervalTree tree = new IntervalTree();
        LocalDateTime base = LocalDateTime.of(2026, 1, 1, 10, 0);

        tree.insert(base, base.plusHours(1)); // 10-11
        tree.insert(base.plusHours(2), base.plusHours(3)); // 12-13
        tree.insert(base.plusHours(4), base.plusHours(6)); // 14-16

        // Check gap (11-12)
        assertFalse(tree.hasOverlap(base.plusMinutes(70), base.plusMinutes(110)));

        // Check overlap with middle
        assertTrue(tree.hasOverlap(base.plusMinutes(150), base.plusMinutes(180)));
    }
}
