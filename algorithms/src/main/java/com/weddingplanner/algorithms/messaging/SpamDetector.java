package com.weddingplanner.algorithms.messaging;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

/**
 * Spam Detector using Sliding Window Log and Hashing.
 */
public class SpamDetector {
    private final int maxMessages;
    private final long windowMillis;
    private final Map<Long, LinkedList<Long>> userMessageTimestamps;

    public SpamDetector(int maxMessages, long windowMillis) {
        this.maxMessages = maxMessages;
        this.windowMillis = windowMillis;
        this.userMessageTimestamps = Collections.synchronizedMap(new HashMap<>());
    }

    /**
     * Checks if a user is exceeding the rate limit.
     * 
     * @param userId The ID of the user sending a message.
     * @return true if it's spam (exceeds limit), false otherwise.
     */
    public boolean isSpam(Long userId) {
        long now = System.currentTimeMillis();

        LinkedList<Long> timestamps = userMessageTimestamps.computeIfAbsent(userId, k -> new LinkedList<>());

        synchronized (timestamps) {
            // Remove timestamps outside the sliding window
            while (!timestamps.isEmpty() && now - timestamps.getFirst() > windowMillis) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= maxMessages) {
                return true;
            }

            timestamps.addLast(now);
            return false;
        }
    }
}
