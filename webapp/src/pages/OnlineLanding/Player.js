module.exports = class Player {
    constructor(id, name) {
        this.name = name;
        this.id = id;
        this.ready = false;
    }
};