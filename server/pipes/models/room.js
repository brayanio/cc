const UserPipe = require('../user.js')
const guid = require('../../utils/guid.js')
const data = require('../../data/module.js')

const getUser = username => UserPipe.getUser(username)

const Monster = require('./monster.js')

module.exports = class {
    constructor(que) {
        this.id = guid()
        this.meta = {connected: que.connected, gameType: que.name, playerCount: que.playerCount, mapName: que.mapName}
        this.monsters = []

        this.data = {
            turnIndex: 0,
            turnCounter: 0,
            changes: []
        }
        if(que.name === 'pve'){
            const monster = new Monster(data().Monster.Skeleton)
            const monster2 = new Monster(data().Monster.Skeleton)

            this.monsters.push(monster, monster2)
            this.teamA = que.connected.map(o => o.username)
            this.teamB = [monster.username, monster2.username]

            const units = [
                ...que.connected.map(o => {return {username: o.username, speed: getUser(o.username).stats.speed}}),
                {username: monster.username, speed: monster.stats.speed},
                {username: monster2.username, speed: monster2.stats.speed}
            ]

            this.data.turnOrder = units.sort((o1, o2) => {
                if (o1.speed < o2.speed)
                    return 1
                if (o1.speed > o2.speed)
                    return -1
                return 0
            }).map(unit => unit.username)
            console.log('TURN ORDER', this.data.turnOrder)
            this.teamA.forEach(username => getUser(username).applyPassives(this, getUser(username), getUser(username)))
        }
        if(que.name === 'raid'){
           let raids = data().Raids[this.meta.mapName]

            const raid1 = raids[Math.floor(Math.random()*raids.length)]
            const raid2 = raids[Math.floor(Math.random()*raids.length)]
            const raid3 = raids[Math.floor(Math.random()*raids.length)]
            const boss = raids[Math.floor(Math.random()*raids.length)]

            raid1.forEach(monster => this.monsters.push(new Monster(data().Monster[monster])))
            this.teamA = que.connected.map(o => o.username)
            this.teamB = this.monsters.map(monster => monster.username)

            const units = [
                ...que.connected.map(o => {return {username: o.username, speed: getUser(o.username).stats.speed}}),
                ...this.monsters.map(monster => {return {username: monster.username, speed: monster.speed}}),
            ]

            this.waves = [raid2, raid3, boss]
            this.data.turnOrder = units.sort((o1, o2) => {
                if (o1.speed < o2.speed)
                    return 1
                if (o1.speed > o2.speed)
                    return -1
                return 0
            }).map(unit => unit.username)
            console.log('TURN ORDER', this.data.turnOrder)
            this.teamA.forEach(username => getUser(username).applyPassives(this, getUser(username), getUser(username)))
        }


        if(que.name === 'pvp'){
            this.teamA= [que.connected[0].username]
            this.teamB= [que.connected[1].username]

            this.data.turnOrder = que.connected.sort((o1, o2) => {
                const user1 = getUser(o1.username)
                const user2 = getUser(o2.username)
                if (user1.armor.speed > user2.armor.speed)
                    return 1
                if (user1.armor.speed < user2.armor.speed)
                    return -1
                return 0
            }).map(user => user.username)
            this.teamA.forEach(username => getUser(username).applyPassives(this, getUser(username), getUser(username)))
            this.teamB.forEach(username => getUser(username).applyPassives(this, getUser(username), getUser(username)))
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
            // console.log('hphphphphp necro issue', User.uiData().health, User.uiData().effects)
            health[o.username] = User.uiData().health
        })
        
        const abilityPacket = (name, target, cooldown) => {
            return {name, target, cooldown}
        }

        if(this.meta.gameType === 'pve' || this.meta.gameType === 'raid'){
            optional.monsters = {}
            this.monsters.forEach(monster => optional.monsters[monster.username] = monster.packet())
        }

        if(this.data.dead)
            optional.dead = this.data.dead

        if(this.data.winner)
            optional.winner = this.data.winner

        if(this.data.loot)
            optional.loot = this.data.loot

        if(this.teamA.includes(username))
            optional.team = 'teamA'
        if(this.teamB.includes(username))
            optional.team = 'teamB'

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
