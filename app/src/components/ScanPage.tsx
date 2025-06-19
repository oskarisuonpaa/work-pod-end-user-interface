import { useNavigate } from "react-router";
import PageWrapper from "./PageWrapper";
import { Scanner } from "@yudiel/react-qr-scanner";

type ScanData = {
  rawValue: string;
};

const ScanPage = () => {
  const navigate = useNavigate();

  const handleScan = (data: ScanData[] | null) => {
    if (!data) return;

    if (data?.[0]?.rawValue) {
      const url = new URL(data[0].rawValue);
      const relativePath = url.pathname + url.search;
      navigate(relativePath, { replace: true });
    }
  };

  return (
    <PageWrapper pageTitle="Scan QR Code">
      <Scanner onScan={handleScan} />
    </PageWrapper>
  );
};

export default ScanPage;
