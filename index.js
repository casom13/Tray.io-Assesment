const program = require('commander');
const readline = require('readline');
const fs = require('fs');

program
    .version('1.0')
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

// open file and process line by line
stream
    .on('line', (data) => {
      if (count === 1) {
        // assign the first line to room size
        room = data.split(' ').map( Number );
      } else if (count === 2) {
        // assign the second line to robot position
        position = data.split(' ').map( Number ); 
      } else if (isNaN(data.substring(0, 1))) {
        // find the instruction line by ensuring the first char is not a number
        instructions = data.split('');
      } else {
        // add the rest of the lines to the dirt map
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
      // ensure there is space to move forward
      if (position[1] + 1 <= room[0]) {
        // move forward
        position[1] += 1;
      }
    }
    if (inst[i] === 'S') {
      // ensure there is space to move backwards
      if (position[1] - 1 >= 0) {
        // move backwards
        position[1] -= 1;
      }
    }
    if (inst[i] === 'E') {
      // ensure there is space to move right 
      if (position[0] + 1 <= room[1]) {
        // move right
        position[0] += 1;
      }
    }
    if (inst[i] === 'W') {
      // ensure there is space to move left 
      if (position[0] - 1 >= 0) {
        // move left
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
  console.log(position[0] + ' ' + position[1]);
  console.log(cleaned);
}
