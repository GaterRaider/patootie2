export default (pageContext: any) => {
    const { urlPathname } = pageContext;
    // Match public routes only
    if (urlPathname === "/" ||
        urlPathname === "/privacy-policy" ||
        urlPathname === "/imprint") {
        return { match: true };
    }
    return { match: false };
};
