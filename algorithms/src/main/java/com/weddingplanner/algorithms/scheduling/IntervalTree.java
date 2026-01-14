package com.weddingplanner.algorithms.scheduling;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Naive interval overlap detection.
 * Baseline implementation for Sprint 2.
 */
public class IntervalTree {

    public static boolean hasOverlap(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2,
            LocalDateTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    public static boolean checkConflicts(LocalDateTime start, LocalDateTime end,
            List<BookingInterval> existingBookings) {
        for (BookingInterval existing : existingBookings) {
            if (hasOverlap(start, end, existing.getStart(), existing.getEnd())) {
                return true;
            }
        }
        return false;
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
