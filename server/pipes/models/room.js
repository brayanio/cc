const UserPipe = require('../user.js')
const guid = require('../../utils/guid.js')
const data = require('../../data/module.js')

const getUser = username => UserPipe.getUser(username)

const Monster = require('./monster.js')

module.exports = class {
    constructor(que) {
        this.id = guid()
        this.meta = {connected: que.connected, gameType: que.name, playerCount: que.playerCount}
        this.monsters = []

        this.data = {
            turnIndex: 0,
            turnCounter: 0,
            changes: []
        }
        if(que.name === 'pve'){
            const monster = new Monster(data().Monster.Skeleton)

            this.monsters.push(monster)
            this.teamA = que.connected.map(o => o.username)
            this.teamB = [monster.username]

            const units = [
                ...que.connected.map(o => {return {username: o.username, speed: getUser(o.username).stats.speed}}),
                {username: monster.username, speed: monster.stats.speed}
            ]

            this.data.turnOrder = units.sort((o1, o2) => {
                if (o1.speed < o2.speed)
                    return 1
                if (o1.speed > o2.speed)
                    return -1
                return 0
            }).map(unit => unit.username)
            console.log('TURN ORDER', this.data.turnOrder)
        }

        if(que.name === 'pvp'){
            this.data.turnOrder = que.connected.sort((o1, o2) => {
                const user1 = getUser(o1.username)
                const user2 = getUser(o2.username)
                if (user1.armor.speed > user2.armor.speed)
                    return 1
                if (user1.armor.speed < user2.armor.speed)
                    return -1
                return 0
            }).map(user => user.username)
        }
    }

    getMonster(id) {
        return this.monsters.find((monster) => monster.username === id)
    }

    userData() {
        const userPackets = this.meta.connected.map(o => getUser(o.username).packet())
        return userPackets
    }

    team(i){
        return i ? this.teamA : this.teamB
    }

    uiData(username) {
        let optional = {}
        const user = getUser(username)
        const health = {}
        let effects = {}
        this.meta.connected.forEach(o => {
            const User = getUser(o.username)
            effects[o.username] = User.stats.effects
            health[o.username] = User.stats.health
        })
        
        const abilityPacket = (name, target, cooldown) => {
            return {name, target, cooldown}
        }

        if(this.meta.gameType === 'pve'){
            optional.monsters = {}
            this.monsters.forEach(monster => optional.monsters[monster.username] = monster.packet())
        }

        if(this.data.dead)
            optional.dead = this.data.dead

        if(this.data.winner)
            optional.winner = this.data.winner

        if(this.data.loot)
            optional.loot = this.data.loot

        optional.team = this.teamA.includes(username) ? 'teamA' : 'teamB'

        return {
            abilityData: [
                abilityPacket(user.weapon.ability.name, user.weapon.ability.target, 0),
                abilityPacket(user.armor.ability.name, user.armor.ability.target, user.stats.cooldowns[user.armor.ability.name] || 0),
                ...user.skills.map(skill => abilityPacket(skill.name, skill.target, user.stats.cooldowns[skill.name] || 0))
            ],
            effects,
            health,
            turnCounter: this.data.turnCounter,
            ...optional
        }
    }

    remove(team, username){
        const alive = this[team].filter(t => t !== username)
        this[team] = alive
        this.data.turnOrder = this.data.turnOrder.filter(t => t !== username)
    }

    disconnect(username) {
        this.meta.connected = this.meta.connected.filter(e => e !== username)
        UserPipe.getUser(username).disconnect()
    }

    packet(username) {
        this.data.userPackets = this.userData()
        const team = this.teamA.includes(username) ? 0 : 1
        const enemyTeam = this.teamA.includes(username) ? 1 : 0
        return {
            packet: 'room',
            data: this.data,
            username,
            uiData: this.uiData(username),
            stats: this.stats,
            teams: [this.teamA, this.teamB],
            team,
            enemyTeam
        }
    }
}
