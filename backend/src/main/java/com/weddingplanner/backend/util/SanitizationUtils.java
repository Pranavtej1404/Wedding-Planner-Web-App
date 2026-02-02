package com.weddingplanner.backend.util;

import org.apache.commons.text.StringEscapeUtils;

public class SanitizationUtils {

    public static String sanitize(String input) {
        if (input == null)
            return null;
        // Basic HTML escaping
        return StringEscapeUtils.escapeHtml4(input).trim();
    }
}
