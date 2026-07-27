import {
  Play,
  Github,
  Home,
  User,
  Code2,
  FolderGit2,
  Mail,
  Linkedin,
  CalendarDays,
  Users,
} from "lucide-react";

// Explicit map (rather than `import * as Icons`) so unused lucide icons
// get tree-shaken out of the production bundle. Add new icons here
// whenever a new icon name is referenced in JSX or data files.
const icons = {
  Play,
  Github,
  Home,
  User,
  Code2,
  FolderGit2,
  Mail,
  Linkedin,
  CalendarDays,
  Users,
};

export default function Icon({ name, className = "" }) {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    if (import.meta.env.DEV) {
      console.warn(`Icon "${name}" was not found in the icons map.`);
    }
    return null;
  }

  return <LucideIcon className={`w-5 h-5 ${className}`} />;
}
