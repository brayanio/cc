const guid = require('./guid.js')
const data = require('../data/module.js')

const buff = (effect, is, aint) => {
    switch(effect.start) {
        case'buff':
            is()
            effect.start = 'remove'
            break
        case 'remove':
            aint()
            effect.start = 'buff'
            break
    }
}

const monsterAttack = (monster) => {
    const {damageDie, level} = monster.monster
    const atk = monster.stats.attack

    let a = attack(level, damageDie)
    a.damage += atk
    a.atk = atk
    return a
}

const attack = (amount, damageDie) => {
    const rolls = []
    let damage = 0
    for (let i = 0; i < amount; i++) {
        const val = Math.ceil(Math.random() * damageDie)
        rolls.push(val)
        damage += val
    }
    return {
        rolls,
        damage
    }
}

const weaponAttack = (caster, r) => {
    const level = caster.weapon.level
    const damageDie = caster.weapon.damageDie
    const attack = caster.weapon.attack
    const rarity = caster.weapon.rarity

    const rolls = []
    let damage = 0
    for (let i = 0; i < level; i++) {
        const val = Math.floor(Math.random() * damageDie) + 1
        rolls.push(val)
        damage += val
    }
    damage += (attack * (r.Rarities.indexOf(rarity) + 1))
    return {
        rolls,
        damage
    }
}

const heal = (caster, r) => {
    const level = caster.armor.level
    const rarity = caster.armor.rarity
    const baseHp = caster.armor.hp

    const total =  baseHp * ((30 + r.Rarities.indexOf(rarity) * level) / 100)

    return {
        total
    }
}

const change = (room, effect, modified, changes)=> room.data.changes.push({
    id: guid(),
    effect,
    modified,
    changes
})

const changeMonster = (room, modified, changes)=> room.data.changes.push({
    id: guid(),
    modified,
    changes
})

const summonMonster = (room, team, monsterName) => {
  const monster = data().Monster[monsterName]
  room[team].push(monster.username)
  room.data.turnOrder.push(monster.username)
  room.monsters.push(monster)
  return monster
}

const addEffect = (effectName, username, targetUsername, abilityName) => {
  const effect = data().Effect[effectName]
  effect.birth = {username, target: targetUsername}
  effect.ability = abilityName || effectName
}

module.exports = {
    guid,
    attack,
    change,
    changeMonster,
    heal,
    weaponAttack,
    buff,
    monsterAttack,
    summonMonster,
    addEffect
}
