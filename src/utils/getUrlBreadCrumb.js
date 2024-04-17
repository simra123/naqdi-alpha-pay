export const getUrlBreadCrumb = (pathname) => {
  if (pathname === "/") {
    return "Home";
  } else {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");
    const formattedSegments = pathSegments
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" > ");
    return formattedSegments || "id";
  }
};
