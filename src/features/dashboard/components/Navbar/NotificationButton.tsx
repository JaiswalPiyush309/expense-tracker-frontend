import { IconButton } from "@/components/ui/IconButton";
import { Bell } from "lucide-react";

export function NotificationButton({
  hasUnread = false,
  onClick,
}: {
  hasUnread?: boolean;
  onClick?: () => void;
}) {
  return (
    <IconButton
      label={hasUnread ? "Notifications (unread)" : "Notifications"}
      onClick={onClick}
    >
      <Bell className="h-5 w-5" />
      {hasUnread && (
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-bad ring-2 ring-surface"
        />
      )}
    </IconButton>
  );
}
