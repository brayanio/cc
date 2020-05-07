const guid = require('../../utils/guid.js')
const EF = require('../../utils/effect-factory.js')
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

   attack(room, target){
        const a = EF.monsterAttack(this)
        target.stats.health -= a.damage
        EF.change(room, {name: this.monster.name},{[target.username]: target.stats}, {
            damage: a.damage
        })
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
