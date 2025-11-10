import type { IconProps } from "@radix-ui/react-icons/dist/types";

export type LandingFeature = {
  id: string;
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
};
