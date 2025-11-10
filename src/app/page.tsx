import { Container, Flex } from "@radix-ui/themes";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { LandingHeader } from "@/components/landing-header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <Flex direction="column" className={styles.page}>
      <LandingHeader />

      <Flex asChild direction="column" className={styles.main}>
        <main>
          <Container size="4">
            <HeroSection />
            <FeaturesSection />
          </Container>
        </main>
      </Flex>
    </Flex>
  );
}
