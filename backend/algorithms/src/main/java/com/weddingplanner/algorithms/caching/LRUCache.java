package com.weddingplanner.algorithms.caching;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Thread-safe LRU Cache implementation using HashMap and Doubly Linked List.
 * Provides O(1) time complexity for both get and put operations.
 */
public class LRUCache<K, V> {
    private final int capacity;
    private final Map<K, Node<K, V>> cache;
    private final Node<K, V> head;
    private final Node<K, V> tail;
    private final ReentrantLock lock = new ReentrantLock();

    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> prev;
        Node<K, V> next;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new ConcurrentHashMap<>(capacity);
        this.head = new Node<>(null, null);
        this.tail = new Node<>(null, null);
        head.next = tail;
        tail.prev = head;
    }

    public V get(K key) {
        lock.lock();
        try {
            Node<K, V> node = cache.get(key);
            if (node == null)
                return null;
            moveToHead(node);
            return node.value;
        } finally {
            lock.unlock();
        }
    }

    public void put(K key, V value) {
        lock.lock();
        try {
            Node<K, V> node = cache.get(key);
            if (node != null) {
                node.value = value;
                moveToHead(node);
            } else {
                Node<K, V> newNode = new Node<>(key, value);
                cache.put(key, newNode);
                addNode(newNode);
                if (cache.size() > capacity) {
                    Node<K, V> last = popTail();
                    if (last != null && last.key != null) {
                        cache.remove(last.key);
                    }
                }
            }
        } finally {
            lock.unlock();
        }
    }

    private void addNode(Node<K, V> node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(Node<K, V> node) {
        Node<K, V> prev = node.prev;
        Node<K, V> next = node.next;
        if (prev != null)
            prev.next = next;
        if (next != null)
            next.prev = prev;
    }

    private void moveToHead(Node<K, V> node) {
        removeNode(node);
        addNode(node);
    }

    private Node<K, V> popTail() {
        if (tail.prev == head)
            return null;
        Node<K, V> res = tail.prev;
        removeNode(res);
        return res;
    }

    public int size() {
        return cache.size();
    }
}
