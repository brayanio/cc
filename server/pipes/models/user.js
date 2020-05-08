const data = require('../../data/module.js')
const guid = require('../../utils/guid.js')
const storage = require('../../utils/storage.js')
const salt = require('../../utils/salt.js')

const nospace = str => str.split(' ').join('')

module.exports = class {
    constructor(username, not_the_password) {
        this.username = username
        this.gold = 0
        const loadedUser = storage.val()[username]
        if(loadedUser && !not_the_password && loadedUser.password)
            this.not_the_password = loadedUser.password
        this.init()
        if (not_the_password) {
            this.not_the_password = salt(not_the_password)
            this.save()
        }
    }

    save(){
        const obj = {
            username: this.username,
            not_the_password: this.not_the_password,
            skills: this.skills || [],
            unlockedSkills: this.unlockedSkills || [],
            inventory: this.inventory || [],
            classData: this.classData || [],
            weapon: nospace(this.weapon.name),
            armor: nospace(this.armor.name),
            gold: this.gold
        }

        if(!storage.val().users)
            storage.change(o => o.users = {[obj.username]:obj})
        else
            storage.change(o => o.users[this.username] = obj)
    }

    init(){
        let user = storage.val().users[this.username]
        if(!user)
            user = {
                armor: 'Breastplate',
                weapon: 'BattleAxe',
                skills: []
            }
        this.armor = data().Armor[user.armor]
        this.weapon = data().Weapon[user.weapon]
        this.skills = user.skills.map(s => data().Ability[s])
        this.stats = {
            health: this.armor.hp + 0,
            attack: this.weapon.attack + 0,
            speed: this.armor.speed,
            effects: [],
            cooldowns: {}
        }
        this.unlockedSkills = user.unlockedSkills || []
        this.not_the_password = user.not_the_password || ''
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
        this.init()
    }

    disconnect() {
        delete this.queName
        delete this.roomId
    }
}
