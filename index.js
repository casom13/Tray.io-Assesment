const program = require('commander');
const readline = require('readline');
const fs = require('fs');

program
    .version('0.9')
    .option('-i, --input [input]', 'txt file containing run data', 'input.txt')
    .parse(process.argv);

let count = 1;
let room = [];
let position = [];
let instructions =[];
const dirtmap = [];

const stream = readline.createInterface({
  input: fs.createReadStream(program.input),
  output: process.stdout,
  terminal: false,
});

stream
    .on('line', (data) => {
      if (count === 1) {
        room = data.split(' ').map( Number );
      } else if (count === 2) {
        position = data.split(' ').map( Number ); 
      } else if (isNaN(data.substring(0, 1))) {
        instructions = data.split('');
      } else {
        dirtmap.push(data.split(' ').map( Number ));
      }
      count += 1;
    })
    .on('close', (data) => {
      robotAction(room, position, instructions, dirtmap);
    });

function robotAction(room, position, inst, map) {
  let cleaned = 0;
  // step through each instruction
  for (let i = 0; i < inst.length; i++) {
    // move in the correct direction
    if (inst[i] === 'N') {
      if (position[1] + 1 <= room[0]) {
        position[1] += 1;
      }
    }
    if (inst[i] === 'S') {
      if (position[1] - 1 <= room[0]) {
        position[1] -= 1;
      }
    }
    if (inst[i] === 'E') {
      if (position[0] + 1 <= room[1]) {
        position[0] += 1;
      }
    }
    if (inst[i] === 'W') {
      if (position[0] - 1 <= room[1]) {
        position[0] -= 1;
      }
    }
    // check for dirt
    const positionString = JSON.stringify(position);
    for (let j = 0; j < map.length; j++) {
      if (JSON.stringify(map[j]) === positionString) {
        // clean the dirt if we find some
        map.splice(j, 1);
        cleaned += 1;
        break;
      }
    }
  }
  // output the answers
  console.log(position);
  console.log(cleaned);
}
