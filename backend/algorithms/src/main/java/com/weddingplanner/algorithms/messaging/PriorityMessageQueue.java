package com.weddingplanner.algorithms.messaging;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Priority Queue (Min Heap) implementation for message ordering.
 * Ensures messages are processed in chronological order based on their
 * timestamp.
 */
public class PriorityMessageQueue<T> {
    private final List<T> heap;
    private final Comparator<T> comparator;

    public PriorityMessageQueue(Comparator<T> comparator) {
        this.heap = new ArrayList<>();
        this.comparator = comparator;
    }

    public void push(T item) {
        heap.add(item);
        siftUp(heap.size() - 1);
    }

    public T pop() {
        if (isEmpty())
            return null;
        T root = heap.get(0);
        T lastItem = heap.remove(heap.size() - 1);
        if (!isEmpty()) {
            heap.set(0, lastItem);
            siftDown(0);
        }
        return root;
    }

    public T peek() {
        return isEmpty() ? null : heap.get(0);
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public int size() {
        return heap.size();
    }

    private void siftUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (comparator.compare(heap.get(index), heap.get(parent)) >= 0)
                break;
            swap(index, parent);
            index = parent;
        }
    }

    private void siftDown(int index) {
        int half = heap.size() / 2;
        while (index < half) {
            int left = 2 * index + 1;
            int right = left + 1;
            int smallest = left;

            if (right < heap.size() && comparator.compare(heap.get(right), heap.get(left)) < 0) {
                smallest = right;
            }

            if (comparator.compare(heap.get(index), heap.get(smallest)) <= 0)
                break;
            swap(index, smallest);
            index = smallest;
        }
    }

    private void swap(int i, int j) {
        T temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
}
