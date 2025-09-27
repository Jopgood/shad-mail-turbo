import { useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface UseSidebarExpansionProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onExpandComplete?: () => void; // Callback for when expansion is complete
}

export function useSidebarExpansion({
  isCollapsed,
  setIsCollapsed,
  onExpandComplete,
}: UseSidebarExpansionProps) {
  const navPanelRef = useRef<ImperativePanelHandle>(null);

  const expandSidebar = () => {
    if (isCollapsed && navPanelRef.current) {
      // Programmatically expand the panel
      navPanelRef.current.expand();
      setIsCollapsed(false);
      document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;

      // Call the completion callback after a brief delay to allow expansion animation
      if (onExpandComplete) {
        setTimeout(onExpandComplete, 100);
      }
    }
  };

  const handlePanelCollapse = () => {
    setIsCollapsed(true);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
  };

  const handlePanelExpand = () => {
    setIsCollapsed(false);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
  };

  return {
    navPanelRef,
    expandSidebar,
    handlePanelCollapse,
    handlePanelExpand,
  };
}