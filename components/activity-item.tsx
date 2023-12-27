
import { format } from "date-fns";
import { AuditLog } from "@prisma/client"

import { generateLogMessage } from "@/lib/generate-log-message";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ActivityItemProps {
  data: AuditLog;
};

export const ActivityItem = ({
  data,
}: ActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-2">
        <p className="text-md text-muted-foreground">
          <span className="text-lg font-bold text-neutral-700">
            {data.userName}
          </span> {generateLogMessage(data)}
          
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};