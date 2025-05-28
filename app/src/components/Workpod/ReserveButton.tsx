import { useTranslation } from "react-i18next";
type Props = {
  slot: { start: string; end: string };
  onReserve: (slot: { start: string; end: string }) => void;
};

const ReserveButton = ({ slot, onReserve }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="button-container">
      <button className="reserve-button" onClick={() => onReserve(slot)}>
        {t("reserve-button")}
      </button>
    </div>
  )
};

export default ReserveButton;
