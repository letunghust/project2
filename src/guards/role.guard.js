export const roleGuard =
    (...roles) =>
    (user) => {
        return roles.includes(user?.role);
    };
