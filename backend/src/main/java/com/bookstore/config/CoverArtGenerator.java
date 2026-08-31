package com.bookstore.config;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * Generates a self-contained SVG book cover (as a base64 data URI) so the
 * catalogue always has cover art without depending on any external image
 * host being reachable.
 */
final class CoverArtGenerator {

    private CoverArtGenerator() {
    }

    private static final Map<String, String[]> CATEGORY_PALETTE = Map.of(
            "Fiction", new String[]{"#7a2e2e", "#a3432f"},
            "Non-Fiction", new String[]{"#1f4e5f", "#2f7a8c"},
            "Science", new String[]{"#1e4d3b", "#2f7a5c"},
            "History", new String[]{"#4a3319", "#82441c"},
            "Fantasy", new String[]{"#3b1f5c", "#6a3aa8"},
            "Biography", new String[]{"#5c3b1f", "#a3591d"}
    );
    private static final String[] DEFAULT_PALETTE = {"#582f1b", "#a3591d"};

    static String generate(String title, String author, String categoryName) {
        String[] colors = CATEGORY_PALETTE.getOrDefault(categoryName, DEFAULT_PALETTE);
        List<String> titleLines = wrap(title, 16);
        List<String> authorLines = wrap(author, 20);

        StringBuilder svg = new StringBuilder();
        svg.append("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'>");
        svg.append("<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>");
        svg.append("<stop offset='0%' stop-color='").append(colors[0]).append("'/>");
        svg.append("<stop offset='100%' stop-color='").append(colors[1]).append("'/>");
        svg.append("</linearGradient></defs>");
        svg.append("<rect width='300' height='450' fill='url(#g)'/>");
        svg.append("<rect x='14' y='14' width='272' height='422' fill='none' stroke='rgba(255,255,255,0.35)' stroke-width='1.5'/>");

        int titleStartY = 190 - (titleLines.size() - 1) * 15;
        svg.append("<text x='150' y='").append(titleStartY)
                .append("' font-family='Georgia, serif' font-size='24' font-weight='bold' fill='#ffffff' text-anchor='middle'>");
        for (int i = 0; i < titleLines.size(); i++) {
            svg.append("<tspan x='150' dy='").append(i == 0 ? 0 : 30).append("'>")
                    .append(escape(titleLines.get(i))).append("</tspan>");
        }
        svg.append("</text>");

        int authorStartY = titleStartY + titleLines.size() * 30 + 24;
        svg.append("<text x='150' y='").append(authorStartY)
                .append("' font-family='Georgia, serif' font-size='15' fill='rgba(255,255,255,0.85)' text-anchor='middle'>");
        for (int i = 0; i < authorLines.size(); i++) {
            svg.append("<tspan x='150' dy='").append(i == 0 ? 0 : 20).append("'>")
                    .append(escape(authorLines.get(i))).append("</tspan>");
        }
        svg.append("</text>");

        svg.append("<circle cx='150' cy='400' r='2' fill='rgba(255,255,255,0.6)'/>");
        svg.append("</svg>");

        String base64 = Base64.getEncoder().encodeToString(svg.toString().getBytes(StandardCharsets.UTF_8));
        return "data:image/svg+xml;base64," + base64;
    }

    private static List<String> wrap(String text, int maxCharsPerLine) {
        List<String> lines = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (String word : text.split("\\s+")) {
            if (current.length() > 0 && current.length() + 1 + word.length() > maxCharsPerLine) {
                lines.add(current.toString());
                current = new StringBuilder();
            }
            if (current.length() > 0) {
                current.append(' ');
            }
            current.append(word);
        }
        if (current.length() > 0) {
            lines.add(current.toString());
        }
        if (lines.isEmpty()) {
            lines.add(text);
        }
        return lines.size() > 3 ? lines.subList(0, 3) : lines;
    }

    private static String escape(String text) {
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
