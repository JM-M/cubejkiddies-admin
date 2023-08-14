import cx from "classnames";

const Status: React.FC<{ status: string }> = ({ status }) => {
  let colorClassName;
  switch (status) {
    case "confirmed":
      colorClassName = "text-blue-500 bg-blue-500 bg-opacity-10";
      break;
    case "en-route":
      colorClassName = "text-orange-500 bg-orange-500 bg-opacity-10";
      break;
    case "delivered":
      colorClassName = "text-green-500 bg-green-500 bg-opacity-10";
      break;
    case "cancelled":
      colorClassName = "text-red-500 bg-red-500 bg-opacity-10";
      break;
    default:
      colorClassName = "text-gray-500 bg-gray-500 bg-opacity-10";
  }
  return (
    <div className={cx("inline-block py-1 px-2 rounded-md", colorClassName)}>
      {status}
    </div>
  );
};

export default Status;
