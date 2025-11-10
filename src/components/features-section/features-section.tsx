"use client";

import { memo } from "react";
import { Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { LANDING_FEATURES } from "@/constants/landing";
import styles from "./features-section.module.css";
import type { FeaturesSectionProps } from "./features-section.types";

export const FeaturesSection = memo<FeaturesSectionProps>(
  function FeaturesSection({ className }) {
    return (
      <Flex
        asChild
        direction="column"
        gap="8"
        py={{ initial: "6", md: "8" }}
        px={{ initial: "4", sm: "6", md: "0" }}
        className={className}
      >
        <section>
          <Heading
            size={{ initial: "7", md: "8" }}
            align="center"
            weight="bold"
            mb="2"
          >
            Todo lo que necesitas para gestionar tus finanzas
          </Heading>

          <Text
            size={{ initial: "3", md: "4" }}
            align="center"
            color="gray"
            mb="6"
          >
            Finny combina inteligencia artificial con herramientas poderosas
            para simplificar tu vida financiera
          </Text>

          <Grid
            columns={{ initial: "1", sm: "2", lg: "4" }}
            gap="4"
            className={styles.grid}
          >
            {LANDING_FEATURES.map((feature) => {
              const IconComponent = feature.icon;

              return (
                <Card
                  key={feature.id}
                  variant="surface"
                  className={styles.card}
                >
                  <Flex direction="column" gap="3" height="100%">
                    <Flex
                      align="center"
                      justify="center"
                      className={styles.iconContainer}
                    >
                      <IconComponent
                        width="24"
                        height="24"
                        color="var(--accent-9)"
                      />
                    </Flex>

                    <Heading size="4" weight="bold">
                      {feature.title}
                    </Heading>

                    <Text size="2" color="gray">
                      {feature.description}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
          </Grid>
        </section>
      </Flex>
    );
  }
);
