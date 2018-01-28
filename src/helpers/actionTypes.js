const async = "async";

const typesConfig = {
    GET_USERS: async,
    GET_FOLLOWERS: async
};

export default (() => {
    const
        types = {},
        states = ["REQUEST", "SUCCESS", "FAILURE"];

    Object.entries(typesConfig).forEach(action => {
        const
            prop = action[0],
            value = action[1];

        if (value === async) {
            const statuses = {toString: () => prop};
            states.forEach(status => statuses[status] = `${prop}_${status}`);
            types[prop] = statuses
        } else {
            types[prop] = prop;
        }
    });

    return types
})();
