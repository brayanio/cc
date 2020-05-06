const data = require('../../data/module.js')
const guid = require('../../utils/guid.js')

module.exports = class {
    constructor(username) {
        this.username = username
        this.init()
    }

    init(){
        this.armor = data().Armor.Breastplate
        this.weapon = data().Weapon.BattleAxe
        this.skills = [data().Ability.Skeleton, data().Ability.Fatigue] //, data().Ability.Rage, data().Ability.Gore]
        this.stats = {
            health: this.armor.hp + 0,
            attack: this.weapon.attack + 0,
            speed: this.armor.speed,
            effects: [],
            cooldowns: {}
        }
        //remove passive and add to stats.effects
        this.skills.forEach((skill) =>
            skill.effects = skill.effects.filter((effect) => {
                const bool = !effect.tags.includes('passive')
                if (!bool) {
                    effect.birth = {username, target: username}
                    effect.ability = skill.name
                    this.stats.effects.push(effect)
                }
                return bool
            }))
    }

    packet() {
        return {
            username: this.username,
            weapon: this.weapon,
            armor: this.armor
        }
    }

    joinQue(name) {
        this.queName = name
    }

    joinRoom(id) {
        this.roomId = id
        this.queName = null
        delete this.queName
    }

    disconnect() {
        delete this.queName
        delete this.roomId
    }
}