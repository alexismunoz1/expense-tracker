"use client";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that wraps the application with Radix UI Theme configuration.
 *
 * Theme Configuration:
 * - accentColor: "indigo" - Primary brand color for buttons, links, and interactive elements
 * - grayColor: "slate" - Neutral color palette for backgrounds and text
 * - radius: "medium" - Border radius scale for consistent rounded corners
 * - scaling: "100%" - Base font size and spacing scale
 * - appearance: "dark" - Dark mode by default (matches current app design)
 * - panelBackground: "solid" - Solid backgrounds for elevated surfaces
 *
 * Accessibility:
 * - Radix UI provides built-in WCAG 2.1 AA compliant color contrasts
 * - Keyboard navigation and focus management handled automatically
 * - ARIA labels and roles included in all components
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <Theme
      accentColor="indigo"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      appearance="dark"
      panelBackground="solid"
    >
      {children}
    </Theme>
  );
}
