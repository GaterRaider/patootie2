// pages/admin/+route.ts
var route_default = (pageContext) => {
  const { urlPathname } = pageContext;
  if (urlPathname.startsWith("/admin")) {
    return { match: true };
  }
  return { match: false };
};
export {
  route_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiK3JvdXRlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCAocGFnZUNvbnRleHQ6IGFueSkgPT4ge1xyXG4gICAgY29uc3QgeyB1cmxQYXRobmFtZSB9ID0gcGFnZUNvbnRleHQ7XHJcbiAgICAvLyBNYXRjaCBhZG1pbiByb3V0ZXNcclxuICAgIGlmICh1cmxQYXRobmFtZS5zdGFydHNXaXRoKFwiL2FkbWluXCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgbWF0Y2g6IHRydWUgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IG1hdGNoOiBmYWxzZSB9O1xyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsSUFBTyxnQkFBUSxDQUFDLGdCQUFxQjtBQUNqQyxRQUFNLEVBQUUsWUFBWSxJQUFJO0FBRXhCLE1BQUksWUFBWSxXQUFXLFFBQVEsR0FBRztBQUNsQyxXQUFPLEVBQUUsT0FBTyxLQUFLO0FBQUEsRUFDekI7QUFDQSxTQUFPLEVBQUUsT0FBTyxNQUFNO0FBQzFCOyIsCiAgIm5hbWVzIjogW10KfQo=
