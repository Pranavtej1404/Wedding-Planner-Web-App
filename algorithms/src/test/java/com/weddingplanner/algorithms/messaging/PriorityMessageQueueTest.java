package com.weddingplanner.algorithms.messaging;

import org.junit.jupiter.api.Test;
import java.util.Comparator;
import static org.junit.jupiter.api.Assertions.*;

public class PriorityMessageQueueTest {

    @Test
    public void testOrdering() {
        PriorityMessageQueue<Integer> queue = new PriorityMessageQueue<Integer>(Comparator.naturalOrder());

        queue.push(10);
        queue.push(5);
        queue.push(20);
        queue.push(1);

        assertEquals(1, queue.pop());
        assertEquals(5, queue.pop());
        assertEquals(10, queue.pop());
        assertEquals(20, queue.pop());
        assertTrue(queue.isEmpty());
    }

    @Test
    public void testLargeDataset() {
        PriorityMessageQueue<Long> queue = new PriorityMessageQueue<Long>(Comparator.reverseOrder());

        for (long i = 0; i < 100; i++) {
            queue.push(i);
        }

        assertEquals(99L, queue.pop());
        assertEquals(98L, queue.pop());
        assertEquals(100 - 2, queue.size());
    }
}
