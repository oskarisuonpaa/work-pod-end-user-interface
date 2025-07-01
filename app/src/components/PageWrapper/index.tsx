import type { ReactNode } from "react";
import "./PageWrapper.css";

/**
 * PageWrapper component provides a consistent layout for pages in the application.
 * It includes a title and optional content area.
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} [props.children] - Optional children to render inside the page content area.
 * @param {string} props.pageTitle - The title of the page to be displayed.
 * @returns {JSX.Element} The rendered page wrapper with title and content.
 * @description This component is used to wrap the main content of a page,
 * providing a consistent structure across different pages in the application.
 * It includes a main section with a title and an optional content area for page content
 */
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
