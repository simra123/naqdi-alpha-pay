import { capitalize } from "@/utils/dataFormatters";

interface Props {
  status: string;
}

const Chip = ({ status }: Props) => {
  let statusColor: string, statusBg: string;

  const capStatus = status ? status?.toLowerCase() : "";

  if (capStatus == "new" || capStatus == "open") {
    statusColor = "text-purple-100";
    statusBg = "bg-purple-10";
  }
  if (capStatus == "pending") {
    statusColor = "text-yellow-light";
    statusBg = "bg-yellow-chip-light";
  }
  if (
    capStatus == "cancel" ||
    capStatus == "cancelled" ||
    capStatus == "withdrawn" ||
    capStatus == "reject"
  ) {
    statusColor = "text-red-chip";
    statusBg = "bg-chip-red";
  }
  if (
    capStatus == "complete" ||
    capStatus == "verified" ||
    capStatus == "confirm" ||
    capStatus == "approved" ||
    capStatus == "accepted" ||
    capStatus == "resolved"
  ) {
    statusColor = "text-green-chip";
    statusBg = "bg-chip-green";
  }

  if (capStatus == "overpay" || capStatus == "closed") {
    statusColor = "text-blue-chip";
    statusBg = "bg-chip-blue";
  }

  if (
    capStatus == "incomplete" ||
    capStatus == "in-progress" ||
    capStatus == "unverified" ||
    capStatus == "unapproved"
  ) {
    statusColor = "text-yellow-dull";
    statusBg = "bg-yellow-chip-dull";
  }

  return (
    <p
      className={`${statusColor} ${statusBg} p-2 min-w-20 max-w-24 text-center text-[14px] font-semibold px-3 rounded-medium`}
    >
      {capitalize(status)}
    </p>
  );
};

export default Chip;
