import { Flex, Spinner, Text } from "@radix-ui/themes";

export const InlineLoadingIndicator = () => {
  return (
    <Flex align="center" gap="2">
      <Spinner size="1" />
      <Text size="2" color="gray">
        Generando respuesta...
      </Text>
    </Flex>
  );
};
