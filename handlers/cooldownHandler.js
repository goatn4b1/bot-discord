const cooldowns = new Map();

module.exports = (key, time = 30) => {

    const now = Date.now();

    if (cooldowns.has(key)) {

        const expiration = cooldowns.get(key) + time * 1000;

        if (now < expiration) {
            return false;
        }
    }

    cooldowns.set(key, now);

    return true;
};