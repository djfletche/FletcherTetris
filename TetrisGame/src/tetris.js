const canvas= document.getElementById("tetris");
const context = canvas.getContext('2d');

context.scale(20,20);

function arenaSweep()
{
    let rowCount = 1;
    // itterate from the bottom up
    //outer is used a a lable in this for loop
    outer: for (let y = arena.length -1; y > 0; --y)
    {
        // nest we loop over x in the normal direction
        for (let x = 0; x < arena[y].length; ++x)
        {
            // if the arena coordinates have a 0 then it is not full
            //
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        // splice returns all the number and when we do that
        // we can then fill it it 0's
        const row = arena.splice(y, 1)[0].fill(0);
        //this ro is moved to the top of the arena
        arena.unshift(row);
        // we need to offset the Y value
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// Function is used to check to see if the blocks are touching
function collide(arena, player)
{
    // we want to check  where the positing of the block and matrix are.
    // double assigner is used
    const [m,o] = [player.matrix, player.pos];

    for (let y = 0; y < m.length; ++y)
    {
        for (let x = 0; x < m[y].length; ++x)
        {
            // if the matrix y and x are not 0 while checking if the arena is not 0
            // we are checking to see if it exists, we have to check for these things
            // we are looking for row and a column in the arena. if the place doesnt exist
            // then it is still true.
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0)
            {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h)
{
    const matrix = [];

    while (h--)
    {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// The draw matrix function is used to get get the position and shapes of the objects
function drawMatrix (matrix, offset)
{
    matrix.forEach((row, y) =>
    {
        row.forEach((value, x) =>
        {
            if (value !== 0)
            {
                context.fillStyle = colors[value];
                context.fillRect(x+ offset.x, y+ offset.y , 1, 1)
            }
        });
    });
}
// we are  using the arena to take the positions of the objects to log them
// we are using that to detect where and when and objects touches.
function merge(arena, player)

{
    player.matrix.forEach((row, y) =>
    {
        row.forEach((value, x) =>
        {
            if (value !== 0)
            {
                // copy the values into arena at the right place
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
function playerDrop()
{
    // This makes our block move down
    player.pos.y++;

    // collide means we are touching the ground or another piece
    if (collide(arena, player))
    {
        // if we are touching then we need to move the player position back to the top
        // after the collision has happened
        player.pos.y--;
        merge(arena, player);
        // we merge the arena and the player
        // Then we set the player back where it needs to be.player.pos.y=0;
        player.pos.y=0;
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}
// the purpose of player move is to stop the objects from leaving the arena
// you are able to escape from the sides if you remove this.
function playerMove(dir)
{
    //taking in the direction
    player.pos.x += dir;
    // checking  if the collision is true
    if (collide(arena,player))
    {
        player.pos.x -= dir;
    }
}

function playerReset() {
    // set all the pieces to a constant
    const pieces = 'TJLOSZI';
    // we are creating the pieces and using the random to decide them
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    // we want the palyer at the top
    player.pos.y = 0;
    // this final function is used to put a position at the bottom. after  that we have to reset
    player.pos.x = (arena[0].length / 2 | 0)- (player.matrix[0].length / 2 | 0);

    // clear the arena if the pieces get all the way to the top
    if (collide(arena, player))
    {

        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}
// we have to apply the rotation to the player so that way we are able to make the rotation work
function playerRotate(dir)
{
    const pos = player.pos.x;
    let offset = 1 ;

    rotate(player.matrix,dir);
    // when we rotate we still need to check for collisions because if we dont the we run into errors
    // while we are rotating on the board.
    while(collide(arena,player))
    {
        player.pos.x += offset;
        // if offset is greater than 0 we will return 1 if not then we will return -1
        // simplified if statement
        offset = -(offset + (offset > 0 ? 1 : -1));

        if (offset > player.matrix[0].length)
        {
            rotate(player.matrix, -dir);
            player.pos.x = pos;

            return;
        }
    }
}

// we need to rotate the matrix
// this is one of the movements the player is able to do
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y)
    {
        for (let x = 0; x < y; ++x)
        {
            // switch the matrix
            // this allows us to transpose the matrix
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    // this will allow us to reverse the matrix
    if (dir > 0)
    {
        matrix.forEach(row => row.reverse());
    }
    else{
        matrix.reverse();
    }
}
// we are using this function to create the pieces.
function createPiece(type)
{
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
        // the numbers change to dictate the color that will be used
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
        // each color is mapped out and the best way was to use different numbers
    } else if (type === 'I') {
        return [
            [0, 5, 0,0],
            [0, 5, 0,0],
            [0, 5, 0,0],
            [0, 5, 0,0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];

    }
}
function draw()
{
    context.fillStyle= '#000';
    context.fillRect(0,0,canvas.width,canvas.height);
    drawMatrix(player.matrix,player.pos);

    // We have to draw the matrix in this function
    drawMatrix(arena,{x: 0,y: 0});
    drawMatrix(player.matrix,player.pos)
}

let dropCounter=0;
let dropInterval=1000;
let lastTime=0;

//the update function is used to keep track of how fast the block is dropping
// When using this you are going to check the time stamps of each move.
// These are not logged in the console but they could be.
function update(time=0)
{
    const deltaTime=time-lastTime;
    lastTime=time;

    dropCounter+= deltaTime;

    if( dropCounter > dropInterval)
    {
       playerDrop();
    }
   lastTime=time;
    draw();
    webkitRequestAnimationFrame(update);
}
const colors =
    [
        null,
        'red',
        'blue',
        'green',
        'pink',
        'orange',
        'yellow',
        'brown',
    ]
const arena = createMatrix(12,20);

const player = {
    pos: {x:5, y: 5},
    matrix: createPiece('T'),
    score:0
    };
function updateScore()
{
    document.getElementById('score').innerText = player.score;
}
// This function is used to crete the event listeners for the keyboard
// by using the keycodes we are able to program cleaner.
document.addEventListener('keydown', event=>
{
    if(event.keyCode === 37)// left
    {
        playerMove(-1);
    }
    else if (event.keyCode ===39)
    {
        playerMove(1);
    }
    // we need to set the drop counter to 0 so that we do not have multiple drops.
    // by setting the drop counter to 0 we get a pause in the down drop.
    // this is used in the entire drop Player drop function
    else if (event.keyCode === 40)
    {
        playerDrop();

    }
    // set the rotation to the q
    else if (event.keyCode === 81)
    {
        playerRotate(-1);
    }
    // set the second rotation to the w
    else if (event.keyCode === 87)
    {
        playerRotate(1);
    }

    });


playerReset();
updateScore();
update();