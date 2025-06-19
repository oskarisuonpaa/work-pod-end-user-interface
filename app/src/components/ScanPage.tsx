import PageWrapper from "./PageWrapper";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanPage = () => {
  return (
    <PageWrapper pageTitle="Scan QR Code">
      <Scanner
        onScan={(data) => {
          console.log("Scanned data:", data);
        }}
      />
    </PageWrapper>
  );
};

export default ScanPage;
