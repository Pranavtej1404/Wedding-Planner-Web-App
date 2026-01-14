package com.weddingplanner.algorithms.scheduling;

import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

/**
 * Load Balancer using a Min Heap to find the vendor with the least workload.
 */
public class BookingLoadBalancer {

    public static class VendorWorkload {
        public Long vendorId;
        public long activeBookings;

        public VendorWorkload(Long vendorId, long activeBookings) {
            this.vendorId = vendorId;
            this.activeBookings = activeBookings;
        }
    }

    /**
     * Finds the vendor with the minimum number of active bookings.
     * Complexity: O(N) to build heap, O(log N) to extract.
     * Since we do it once, it's efficient for large vendor pools.
     */
    public static Long getLeastBusyVendor(List<VendorWorkload> workloads) {
        if (workloads == null || workloads.isEmpty())
            return null;

        PriorityQueue<VendorWorkload> minHeap = new PriorityQueue<>(
                Comparator.comparingLong(w -> w.activeBookings));

        minHeap.addAll(workloads);
        return minHeap.peek().vendorId;
    }
}
