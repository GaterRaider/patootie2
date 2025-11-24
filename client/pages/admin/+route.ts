export default (pageContext: any) => {
    const { urlPathname } = pageContext;
    // Match admin routes
    if (urlPathname.startsWith("/admin")) {
        return { match: true };
    }
    return { match: false };
};
