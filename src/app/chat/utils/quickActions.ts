import {
  QuestionMarkCircledIcon,
  PlusIcon,
  BarChartIcon,
  CameraIcon,
  ImageIcon,
} from "@radix-ui/react-icons";
import type { QuickAction } from "../types";

/**
 * Quick action buttons configuration for the welcome screen
 */
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "help",
    label: "¿En qué puedo ayudarte?",
    icon: QuestionMarkCircledIcon,
    message: "¿En qué puedes ayudarme?",
  },
  {
    id: "add-expense",
    label: "Agregar gasto",
    icon: PlusIcon,
    message: "Deseo agregar un gasto nuevo",
  },
  {
    id: "view-expenses",
    label: "Ver mis gastos",
    icon: BarChartIcon,
    message: "Mostrar todos mis gastos",
  },
  {
    id: "camera",
    label: "Tomar foto",
    icon: CameraIcon,
    requiresAction: true,
  },
  {
    id: "gallery",
    label: "Galería",
    icon: ImageIcon,
    requiresAction: true,
  },
];

/**
 * Gets the main help action
 */
export function getHelpAction(): QuickAction {
  return QUICK_ACTIONS[0];
}

/**
 * Gets actions that require special handling (camera, gallery)
 */
export function getActionButtons(): QuickAction[] {
  return QUICK_ACTIONS.filter((action) => !action.requiresAction);
}

/**
 * Gets actions that need custom onClick handlers
 */
export function getSpecialActions(): QuickAction[] {
  return QUICK_ACTIONS.filter((action) => action.requiresAction);
}
