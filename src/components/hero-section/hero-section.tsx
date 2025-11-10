"use client";

import { memo } from "react";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { LANDING_HERO } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./hero-section.types";

export const HeroSection = memo<HeroSectionProps>(function HeroSection({
  className,
}) {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(ROUTES.CHAT);
  };

  return (
    <Flex
      asChild
      direction="column"
      align="center"
      justify="center"
      gap="6"
      py={{ initial: "8", md: "9" }}
      px={{ initial: "4", sm: "6", md: "0" }}
      style={{ margin: "auto" }}
      className={className}
    >
      <section className={styles.hero}>
        <Heading
          size={{ initial: "8", md: "9" }}
          align="center"
          weight="bold"
          className={styles.title}
        >
          {LANDING_HERO.TITLE}
        </Heading>

        <Text
          size={{ initial: "4", md: "5" }}
          align="center"
          color="gray"
          className={styles.subtitle}
        >
          {LANDING_HERO.SUBTITLE}
        </Text>

        <Button
          size="4"
          variant="solid"
          onClick={handleGetStarted}
          className={styles.cta}
          style={{ cursor: "pointer" }}
        >
          {LANDING_HERO.CTA_PRIMARY}
        </Button>
      </section>
    </Flex>
  );
});
