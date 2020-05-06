const guid = require('../../utils/guid.js')

module.exports = class {
    constructor(monster) {
        this.username = guid()
        this.monster = monster
        this.init()
    }

    init(){
        this.stats = {
            health: this.monster.hp + 0,
            attack: this.monster.attack + 0,
            speed: this.monster.speed,
            effects: []
        }
    }

    packet() {
        return {
            id: this.username,
            username: this.monster.name,
            health: this.stats.health,
            effects: this.stats.effects
        }
    }
}