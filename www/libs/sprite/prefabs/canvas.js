import nggt from '../../../nggt/nggt.js'
import Layout from './layout.js'

export default (...template) => nggt.create({
  template: `<div class="canvas" id="canvas" game="canvas">
    ${Join(...template)}
  </div>`,
  run: ui => {
    
  }
})

/*
import Entity from ''
<max_size:10>

<player:entity level="0" race="'Human'">
  <inventory max_size> // player.inventory[0][0]
    <0>
      <0></0>
    </0>
  </inventory>

  @getItem(x,y){
    return player.inventory[x][y].val()
  }
</player>

<sprite:pipe zoom="1" sprites="[]">
</sprite>

// 

<template>
  <bold:player.name>
  <hr>
  <el:`level: ${player.level}>`
  <BtnAuto:'Select' click:player.getItem(0,0).select()>
</template>


*/