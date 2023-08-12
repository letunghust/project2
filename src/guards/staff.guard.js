export const staffGuard =
    (...departmentIds) =>
    (user) => {
        if (user?.role === 1 || user?.role === 2) {
            return true;
        }
        return departmentIds.includes(user?.departmentId);
    };
