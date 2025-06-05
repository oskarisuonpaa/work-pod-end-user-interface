import type { ReactNode } from "react";
import "./PageWrapper.css";

const PageWrapper = ({
  children,
  pageTitle,
}: {
  children?: ReactNode;
  pageTitle: string;
}) => {
  return (
    <main className="page-wrapper">
      <div className="page-title-container">
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      {children && <div className="page-content">{children}</div>}
    </main>
  );
};

export default PageWrapper;
