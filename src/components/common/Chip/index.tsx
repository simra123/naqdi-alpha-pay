import { capitalize } from "@/utils/dataFormatters";

interface Props {
  status: string;
}

const Chip = ({ status }: Props) => {
  let statusColor: string, statusBg: string;

  const capStatus = capitalize(status);

  if (capStatus == "New" || capStatus == "Open") {
    statusColor = "text-purple-100";
    statusBg = "bg-purple-10";
  }
  if (capStatus == "Pending") {
    statusColor = "text-yellow-light";
    statusBg = "bg-yellow-chip-light";
  }
  if (
    capStatus == "Cancel" ||
    capStatus == "Cancelled" ||
    capStatus == "Withdrawn" ||
    capStatus == "Reject"
  ) {
    statusColor = "text-red-chip";
    statusBg = "bg-chip-red";
  }
  if (
    capStatus == "Complete" ||
    capStatus == "Verified" ||
    capStatus == "Confirm" ||
    capStatus == "Resolved"
  ) {
    statusColor = "text-green-chip";
    statusBg = "bg-chip-green";
  }

  if (capStatus == "Overpay" || capStatus == "Closed") {
    statusColor = "text-blue-chip";
    statusBg = "bg-chip-blue";
  }

  if (capStatus == "Incomplete" || capStatus == "Unverified") {
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
