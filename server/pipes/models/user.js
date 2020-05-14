const data = require('../../data/module.js')
const guid = require('../../utils/guid.js')
const storage = require('../../utils/storage.js')
const salt = require('../../utils/salt.js')

const nospace = str => str.split(' ').join('')

module.exports = class {
    constructor(username, not_the_password) {
        this.username = username
        this.gold = 0
        const loadedUser = storage.val().users ? storage.val().users[username] : null
        if(loadedUser && !not_the_password && loadedUser.not_the_password)
            this.not_the_password = loadedUser.not_the_password
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
            skills: this.skills ? this.skills.map(s => s.name) : [],
            unlockedSkills: this.unlockedSkills || [],
            inventory: this.inventory || [],
            classData: this.classData || {}, // ClassData.Necromancer = {experience: 0, level: 1}
            weapon: nospace(this.weapon.name),
            armor: nospace(this.armor.name),
            gold: this.gold,
            map: this.map || 'Tomb'
        }

        if(!storage.val().users)
            storage.change(o => o.users = {[obj.username]:obj})
        else
            storage.change(o => o.users[this.username] = obj)
    }

    init(){
        if(!storage.val().users){
            console.log('[user][creating storage user table]')
            storage.change(o => o.users = {})
        }
        let user = storage.val().users[this.username]
        if(!user)
            user = {
                armor: 'Breastplate',
                weapon: 'BattleAxe',
                skills: []
            }
        this.armor = data().Armor[user.armor]
        this.weapon = data().Weapon[user.weapon]
        this.classData = user.classData ? user.classData : {}
        this.map = user.map || 'Tomb'

        this.skills = user.skills.map(s => data().Ability[s])
        let bonus = []
        this.skills.forEach(o => o && o.className ? bonus.push(o.className) : '')

        let bonusFullEffect, bonusMultiEffect
        if(bonus.length >= 1) {
            bonusMultiEffect = data().Effect[data().ClassData[bonus[0]].multiBonus]
            bonusMultiEffect.birth = {username: this.username, target: this.username}
            bonusMultiEffect.ability = bonusMultiEffect.name
            if(bonus.length >= 2 && bonus[0] === bonus[1]){
                bonusFullEffect = data().Effect[data().ClassData[bonus[0]].fullBonus]
                bonusFullEffect.birth = {username: this.username, target: this.username}
                bonusFullEffect.ability = bonusFullEffect.name
            } else if(bonus.length >= 2) {
                bonusFullEffect = data().Effect[data().ClassData[bonus[1]].multiBonus]
                bonusFullEffect.birth = {username: this.username, target: this.username}
                bonusFullEffect.ability= bonusFullEffect.name
            }
        }
        this.stats = {
            maxHealth: this.armor.hp + 0,
            health: this.armor.hp + 0,
            attack: this.weapon.attack + 0,
            speed: this.armor.speed,
            effects: [],
            cooldowns: {}
        }
        if(bonusFullEffect)
            this.stats.effects.push(bonusFullEffect)
        if(bonusMultiEffect)
            this.stats.effects.push(bonusMultiEffect)
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

    applyPassives(room, caster, target){
        this.stats.effects.forEach(effect =>
            data().EffectFn[nospace(effect.name)](room, caster, target, effect)
        )
    }

    uiData(){
        return {
            health: this.stats.health,
            effects: this.stats.effects,
        }
    }

    packet() {
        return {
            username: this.username,
            weapon: this.weapon,
            armor: this.armor,
            unlockedSkills: this.unlockedSkills,
            skills: this.skills,
            classData: this.classData,
            map: this.map
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
