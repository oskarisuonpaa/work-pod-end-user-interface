import type { ReactNode } from "react";

const PageWrapper = ({
  children,
  pageTitle,
}: {
  children: ReactNode;
  pageTitle: string;
}) => {
  return (
    <div className="page-wrapper">
      <div className="page-title-container">
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
};

export default PageWrapper;
