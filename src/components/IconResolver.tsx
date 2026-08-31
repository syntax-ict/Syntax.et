import {
  Cpu,
  Shield,
  BookOpen,
  Briefcase,
  Network,
  Combine,
  Code2,
  Wrench,
  Camera,
  Fingerprint,
  Key,
  MapPin,
  Layers,
  Timer,
  Users,
  GraduationCap,
  Printer,
  Megaphone,
  Laptop,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Cpu,
  Shield,
  BookOpen,
  Briefcase,
  Network,
  Combine,
  Code2,
  Wrench,
  Camera,
  Fingerprint,
  Key,
  MapPin,
  Layers,
  Timer,
  Users,
  GraduationCap,
  Printer,
  Megaphone,
  Laptop,
  HelpCircle,
};

/**
 * Renders a Lucide icon from its name (as stored in the backend's `icon`
 * string columns on categories/services). Falls back to a generic icon for
 * any name this map doesn't recognize, rather than crashing on
 * admin-entered content this frontend hasn't been updated to expect.
 */
export const IconResolver = ({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = ICONS[name] || HelpCircle;
  return <IconComponent className={className} />;
};
