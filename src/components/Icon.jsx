import {
  Play,
  Pause,
  ArrowLeft,
  Github,
  Home,
  User,
  Code2,
  FolderGit2,
  Mail,
  Linkedin,
  CalendarDays,
  Users,
  X,
  Image as ImageIcon,
} from "lucide-react";

// Explicit map (rather than `import * as Icons`) so unused lucide icons
// get tree-shaken out of the production bundle. Add new icons here
// whenever a new icon name is referenced in JSX or data files.
const icons = {
  Play,
  Pause,
  ArrowLeft,
  Github,
  Home,
  User,
  Code2,
  FolderGit2,
  Mail,
  Linkedin,
  CalendarDays,
  Users,
  X,
  Image: ImageIcon,
};

export default function Icon({ name, className = "", size }) {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    if (import.meta.env.DEV) {
      console.warn(`Icon "${name}" was not found in the icons map.`);
    }
    return null;
  }

  if (size) {
    return <LucideIcon size={size} className={className} aria-hidden="true" />;
  }

  return <LucideIcon className={`w-5 h-5 ${className}`} aria-hidden="true" />;
}
