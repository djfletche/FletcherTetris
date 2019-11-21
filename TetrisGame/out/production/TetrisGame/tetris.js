const canvas= document.getElementById("tetris");
const context = canvas.getContext('2d');

context.scale(20,20);

//This is used to create the T shape in Tetris Without the first column then the
//game piece wouldn't be able to flip the way it needed to.

const matrix =
    [
    [0,0,0],
    [1,1,1],
    [0,1,0],
    ];
// Function is used to chcck to see if the blocks are touching
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
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'purple';
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

        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
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
// Thsee are not logged in the console but they could be.
function update(time=0){
    const deltaTime=time-lastTime;
    lastTime=time;

    dropCounter+= deltaTime;
    if( dropCounter > dropInterval)
    {
        player.pos.y++;
        dropCounter=0;
    }
    console.log(time);
    draw();
    webkitRequestAnimationFrame(update);
}

const arena = createMatrix(12,20);

const player = {
    pos: {x:5, y: 5},
    matrix: matrix,
    };

// This function is used to crete the event listeners for the keyboard
// by using the keycodes we are able to program cleaner.
document.addEventListener('keydown', event=>
{
    if(event.keyCode === 37)// left
    {
        player.pos.x--;
    }
    else if (event.keyCode ===39)
    {
        player.pos.x++;
    }
    // we need to set the drop counter to 0 so that we do not have multiple drops.
    // by setting the drop counter to 0 we get a pause in the down drop.
    // this is used in the entire drop Player drop function
    else if (event.keyCode === 40)
    {
        playerDrop();

    }
    else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

update();