package com.weddingplanner.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.LinkedList;

@Component
public class RateLimitingFilter implements Filter {

    private final ConcurrentHashMap<String, LinkedList<Long>> requestLogs = new ConcurrentHashMap<>();
    private final int MAX_REQUESTS = 100;
    private final long WINDOW_MS = 60000; // 1 minute

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String clientIp = httpRequest.getRemoteAddr();
        long now = System.currentTimeMillis();

        requestLogs.putIfAbsent(clientIp, new LinkedList<>());
        LinkedList<Long> logs = requestLogs.get(clientIp);

        synchronized (logs) {
            // Remove old logs outside the current window
            while (!logs.isEmpty() && now - logs.peekFirst() > WINDOW_MS) {
                logs.removeFirst();
            }

            if (logs.size() >= MAX_REQUESTS) {
                httpResponse.setStatus(429);
                httpResponse.getWriter().write("Too Many Requests. Please try again later.");
                return;
            }

            logs.addLast(now);
        }

        chain.doFilter(request, response);
    }
}
