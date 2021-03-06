const nggt = require('../utils/nggt.js')
const data = require('../data/module.js')
const EF = require('../utils/effect-factory.js')
const guid = require('../utils/guid.js')
const MONSTER_EXP_TABLE = [1, 1, 15, 100, 250]
const CLASS_EXP_TABLE = [0, 0, 10, 300, 2000, 12500]

//class levels

// 10 = lv 2 "10 kills", 300 = lv 3 "15 kills", 2000 = lv 4 "20 kills", 12500 = lv 5 "50 kills"


// pipes
const UserPipe = require('./user.js')
const RoomPipe = nggt.pipe()
const Monster = require('./models/monster.js')
// utils
const getUser = username => UserPipe.getUser(username)
const nospace = str => str.split(' ').join('')

// fns
const doEffect = (room, caster, target, effect) =>
    data().EffectFn[nospace(effect.name)](room, caster, target, effect)

const runEffectEvent = (start, effect, room, user, targetUser) => {
    if (effect.start === start)
        doEffect(room, user, targetUser, effect)
}

const ability = (username, t, abilityName) => {
    // modify to be used with Monster
    const user = getUser(username)
    const room = RoomPipe[user.roomId].val()
    const ability = data().Ability[nospace(abilityName)]
    let target
    if (room.meta.gameType === 'pvp' || ability.target === 'self' || ability.taret === 'ally')
        target = getUser(t)
    else
        target = room.getMonster(t)
    // console.log(target, t, 'here')
    if (room.data.turnOrder[room.data.turnIndex] !== username)
        return null
    user.stats.cooldowns[ability.name] = ability.cooldown
    ability.effects = ability.effects.filter(effect => {
        effect.ability = nospace(ability.name)
        effect.birth = { username, target: t, isUser: room.meta.gameType === 'pvp' }
        runEffectEvent('instant', effect, room, user, target)
        runEffectEvent('buff', effect, room, user, target)
        return effect.start !== 'instant' && !effect.tags.includes('passive')
    })
    target.stats.effects = target.stats.effects.concat(ability.effects)

    //end turn
    user.stats.effects = user.stats.effects.filter(effect => {
        runEffectEvent('turnend', effect, room, user, target)
        if (!effect.tags.includes('passive') && effect.duration)
            effect.duration--
        if (effect.duration === 0 && effect.duration !== null) {
            runEffectEvent('remove', effect, room, user, target)
            return false
        }
        return true
    })

    turnOver(room)
    runTurn(room)
}
const runTurn = (room) => {
    let userData = room.data.turnOrder[room.data.turnIndex]
    if (!room.winner) {
        if (room.getMonster(userData))
            monsterStartTurn(room)
        else
            userStartTurn(room)
    }
}
const monsterStartTurn = (room) => {
    const currentMonster = room.getMonster(room.data.turnOrder[room.data.turnIndex])
    if (!currentMonster) return null
    const target = (e) => {
        if (!room.getMonster(e) || !room.getMonster(e).monster)
            return getUser(e)
        else
            return room.getMonster(e)
    }
    currentMonster.stats.effects.forEach(effect =>
        runEffectEvent('turnstart', effect, room, target(effect.birth.username), target(effect.birth.target))
    )
    currentMonster.stats.effects.forEach(effect =>
        runEffectEvent('buff', effect, room, target(effect.birth.username), target(effect.birth.target))
    )
    let randTarget = getUser(room.teamA[Math.floor(Math.random() * room.teamA.length)])
    currentMonster.attack(room, randTarget)

    currentMonster.stats.effects = currentMonster.stats.effects.filter(effect => {
        runEffectEvent('turnend', effect, room, target(effect.birth.username), target(effect.birth.target))
        if (!effect.tags.includes('passive') && effect.duration)
            effect.duration--
        if (effect.duration === 0 && effect.duration !== null) {
            runEffectEvent('remove', effect, room, target(effect.birth.username), target(effect.birth.target))
            return false
        }
        return true
    })

    turnOver(room)
    let userData = room.data.turnOrder[room.data.turnIndex]
    if (!room.winner) {
        if (room.getMonster(userData))
            monsterStartTurn(room)
        else
            userStartTurn(room)
    }
    checkDead(room)
}

const turnOver = (room) => {
    checkDead(room)
    if (room.data.turnIndex + 1 >= room.data.turnOrder.length)
        room.data.turnIndex = 0
    else
        room.data.turnIndex++

    room.data.turnCounter++
}

const checkDead_pve = (room, dead) => {
    if (room.meta.gameType === 'pve') 
        room.teamB.forEach(username => {
            if (room.getMonster(username).stats.health <= 0) {
                room.remove('teamB', username)
                dead[username] = room.getMonster(username)
                checkExp(room, dead[username])
                checkLoot(room, dead[username])
            }
        })
}

const checkDead_raid = (room, dead) => {
    if (room.meta.gameType === "raid") {
        room.teamB.forEach(username => {
            if (room.getMonster(username).stats.health <= 0) {
                room.remove('teamB', username)
                dead[username] = room.getMonster(username)
                checkExp(room, dead[username])
                checkLoot(room, dead[username])
            }
        })
        if (room.waves && room.teamB.length === 0 && room.waves.length > 0) {
            /// Add Intermission Ad Here
            room.monsters = room.waves.pop().map(monster => new Monster(data().Monster[monster]))
            room.teamB = room.monsters.map(monster => monster.username)
            room.data.turnOrder = [...room.teamA.map(username => getUser(username)), ...room.monsters].sort((o1, o2) => {
                if (o1.speed < o2.speed)
                    return 1
                if (o1.speed > o2.speed)
                    return -1
                return 0
            }).map(unit => unit.username)
            // console.log('TURN ORDER', room.data.turnOrder)
            room.data.turnIndex = 0
            runTurn(room)
        }
    }
}

const checkDead_pvp = (room, team, dead) => {
    if (room.meta.gameType === "pvp") {
        room.teamB.forEach(username => {
            if (getUser(username).stats.health <= 0) {
                room.remove('teamB', username)
                dead[username] = getUser(username)
                checkLoot(room, dead[username])
            }
        })
    }
}

const checkLevel = (user, i, exp) => {
    if (user.skills[i]) { //level up skill 1
        let c = user.classData[user.skills[i].className]
        if (!c)
            c = user.classData[user.skills[i].className] = {
                level: 1,
                exp: 0
            }
        c.exp += exp
        if (c.exp >= CLASS_EXP_TABLE[c.level]) {
            c.exp -= CLASS_EXP_TABLE[c.level]
            c.level++
            const classData = data().ClassData[user.skills[i].className]
            // console.log('LEVELS', classData.skills, c.level)
            classData.skills.forEach(skill => {
                if (skill.classLevel === c.level) {
                    user.unlockedSkills.push(skill.name)
                    // console.log('LEVELED UP', user.unlockedSkills)
                    user.save()
                }
            })
        }
    }
}

const checkExp = (room, deadUser) => {
    const exp = MONSTER_EXP_TABLE[deadUser.monster.level]
    // console.log('Check Dead - works', deadUser)
    room.teamA.forEach(username => {
        const user = getUser(username)
        checkLevel(user, 0, exp)
        checkLevel(user, 1, exp)
    })
}

const checkLoot = (room, deadUser) => {
    if (deadUser.monster) {
        if(deadUser.monster.loot)
            Object.keys(deadUser.monster.loot).forEach(skill => {
                if(room.data.loot && room.data.loot.includes(skill))
                    return null
                const chance = deadUser.monster.loot[skill]
                const roll = Math.floor(Math.random() * 100)
                if (roll <= chance)
                    !room.data.loot ? room.data.loot = [skill] : room.data.loot.push(skill)
            })
        
        if(deadUser.monster.bossLoot)
            Object.keys(deadUser.monster.bossLoot).forEach(item => {
                if(room.data.bossLoot && room.data.bossLoot.includes(item))
                    return null
                const chance = deadUser.monster.bossLoot[item]
                const roll = Math.floor(Math.random() * 100)
                if (roll <= chance)
                    !room.data.bossLoot ? room.data.bossLoot = [item] : room.data.bossLoot.push(item)
            })
    }
}

const checkDead = (room) => {
    let dead = {}
    // checkDead for teamA (always a player)
    room.teamA.forEach(username => {
        if (getUser(username).stats.health <= 0) {
            room.remove('teamA', username)
            dead[username] = getUser(username)
        }
    })
    checkDead_pve(room, dead)
    checkDead_raid(room, dead)
    checkDead_pvp(room, dead)


    if (room.teamB.length === 0 && room.teamA.length === 0) {
        room.data.winner = 'draw'
    }
    if (room.teamB.length === 0) {
        room.data.winner = 'teamA'
        room.meta.connected.forEach(o => {
            const user = getUser(o.username)
            // Skill Loot
            if (user && user.unlockedSkills && room.data.loot)
                room.data.loot.forEach(skill => {
                    if (!user.unlockedSkills.includes(skill) && !user.skills.find(s => s.name === skill)) {
                        user.unlockedSkills.push(skill)
                        user.save()
                    }
                })
            // Item Loot
            if (user && user.inventory && room.data.bossLoot) {
                room.data.bossLoot.forEach(item => {
                    if (!user.inventory.includes(item) && !user.armor.name === item && !user.weapon.name === item) {
                        user.inventory.push(item)
                        user.save()
                    }
                })
            }
        })
    }

    if (room.teamA.length === 0)
        room.data.winner = 'teamB'
    if (room.data.winner)
        room.data.turnIndex = -69
    // Object.keys(dead).forEach((u) => data[u].disconnect ? data[u].disconnect() : null)
    room.data.dead = !room.data.dead ? Object.keys(dead) : room.data.dead.concat(Object.keys(dead))
    // console.log(room.data.winner, room.teamA, room.teamB, room.data.dead, 'he;;p[]=asdfg[g')
}
const userStartTurn = (room) => {
    const currentUser = getUser(room.data.turnOrder[room.data.turnIndex])
    // console.log(currentUser.stats.effects.filter(e => e.start === 'turnstart'))
    currentUser.stats.effects.forEach(effect =>
        runEffectEvent('turnstart', effect, room, currentUser, getUser(effect.birth.target))
    )
    currentUser.stats.effects.forEach(effect =>
        runEffectEvent('buff', effect, room, currentUser, getUser(effect.birth.target))
    )
    if (currentUser.stats.cooldowns)
        Object.keys(currentUser.stats.cooldowns).forEach((abilityname) => {
            if (currentUser.stats.cooldowns[abilityname] - 1 >= 0)
                currentUser.stats.cooldowns[abilityname]--
        })
    checkDead(room)
}

const turnIndex = (username, changeId) => {
    const user = getUser(username)
    if (user && user.roomId) {
        // console.log(RoomPipe[user.roomId].val().data.turnIndex)
        const room = RoomPipe[user.roomId].val()

        if (room.data.changes.length > 0) {
            if (!changeId)
                return { turnIndex: Math.random() }
            else {
                let index
                room.data.changes.find((e, i) => changeId === e.id ? index = i : null)

                if (index === room.data.changes.length - 1)
                    return { turnIndex: room.data.turnIndex }
                return { turnIndex: Math.random() }
            }
        }
        return { turnIndex: room.data.turnIndex }
    }
}

const changes = (username, changeId) => {
    const user = getUser(username)
    if (user && user.roomId) {
        const room = RoomPipe[user.roomId].val()
        let index
        room.data.changes.find((e, i) => changeId === e.id ? index = i : null)

        if (!index)
            return { changes: JSON.parse(JSON.stringify(room.data.changes)).reverse(), uiData: room.uiData(username) }

        return { changes: room.data.changes.slice(index + 1).reverse(), uiData: room.uiData(username) }
    }
}

const startGame = (room) => {
    let e = room.getMonster(room.data.turnOrder[room.data.turnIndex])
    if (e)
        monsterStartTurn(room)
    else
        userStartTurn(room)
}


module.exports = { RoomPipe, ability, turnIndex, changes, startGame }
