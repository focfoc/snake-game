//스네이크 게임 불러오기
const snakeLoad = function () {
    //맵생성 x = width , y = height
    const x = 17, y = 17;
    let self;
    const snake = {
        snake_table : document.querySelector('[data-snake-table]'),
        snake_view : document.querySelector('[data-snake-snake]'),
        apple : document.querySelector('[data-apple]'),
        snake_size : window.getComputedStyle(document.querySelector('[data-snake-snake]')).width.replace('px', ''),
        move : 1,
        apple_loaction : 0,
        snake_arr : [],
    };
    return {
        init: function () {
            self = this;

            if(snake.snake_size > 100) location.reload();
            
            //스네이크 세팅
            self.initSnake();
            
            //사과 랜덤
            self.randomApple();
            
            //스네이크 동작
            self.moveSnake();
        },
        //스네이크 세팅
        //스네이크 맵 꾸미기(div에 width값을 줘서 흰색 테두리를 준다)
        initSnake : function(){

            //스네이크 맵 꾸미기(div에 width값을 줘서 흰색 테두리를 준다)
            document.querySelector('.box-top').style.width = snake.snake_size * x + 'px';
            document.querySelector('.box-bottom').style.width = snake.snake_size * x + 'px';
            document.querySelector('.box-bottom').style.height = snake.snake_size * y + 'px';

            //스네이크 보여주기
            self.reloadSnake();

        },
        //스네이크 초기화
        reloadSnake : function(){
            //스네이크 뿌릴 위치
            const center_x = Math.ceil(x/ 4) - 1 ;
            const center_y = Math.ceil(y/ 2) - 1 ;
            snake.snake_arr = [ center_y * y + center_x ];
            //화면에 노출
            document.querySelectorAll('[data-snake-table] [data-snake-snake]').forEach((elem) => elem.remove());;
            self.loadSnake(snake.snake_arr[0]);
        },
        //스네이크 보여주기(추가되는 경우)
        loadSnake : function(element){       
            const snakeNode = snake.snake_view.cloneNode(true);
            snakeNode.style.top = snake.snake_size * ( Math.floor(element / y) ) + 'px';
            snakeNode.style.left = snake.snake_size * ( element % x ) + 'px';
            snakeNode.classList.remove("hide");
            snake.snake_table.prepend(snakeNode);   
        },
        //사과 랜덤
        randomApple : function(){
            const apple_x = Math.floor(Math.random() * x);
            const apple_y = Math.floor(Math.random() * y);
            const location = apple_y * y + apple_x;

            //스네이크에 닿는 경우 재호출
            if(snake.snake_arr.includes(location)){ self.randomApple(); return false; } 

            snake.apple.style.top = snake.snake_size * apple_y + 'px';        
            snake.apple.style.left = snake.snake_size * apple_x + 'px';

            //apple_location 설정
            snake.apple_loaction = location;

        },
        //스네이크 움직이기
        moveSnake : function(){

            /* setInterval(() => {

                const snakeArr = document.querySelectorAll('[data-snake-table] [data-snake-snake]');
                const firstSnake = snakeArr[0];//뱀의 머리
                const lastSnake = snakeArr[snakeArr.length - 1];//뱀의 꼬리

                //실제 값 변경
                snake.snake_arr.unshift(snake.snake_arr[0] + snake.move);
                snake.snake_arr.length = snake.snake_arr.length - 1;

                //사과 먹은 경우
                console.log("apple" + snake.apple_loaction);
                console.log(snake.snake_arr);
                console.log(snake.snake_arr.includes(snake.apple_loaction));
                //먹지 않은 경우

                //실제로 이동
                if(snake.move == 1){ //오른쪽
                    firstSnake.style.left = (  Number(lastSnake.style.left.replace('px', '')) + Number(snake.snake_size) ) + 'px';
                }else if(snake.move == -1){ //왼쪽
                    firstSnake.style.left = (  Number(lastSnake.style.left.replace('px', '')) - Number(snake.snake_size) ) + 'px';
                }else if(snake.move == -x){ //위
                    firstSnake.style.top = (  Number(lastSnake.style.top.replace('px', '')) - Number(snake.snake_size) ) + 'px';
                }else if(snake.move == x){ //아래
                    firstSnake.style.top = (  Number(lastSnake.style.top.replace('px', '')) + Number(snake.snake_size) ) + 'px';
                }
                snake.snake_table.insertBefore(lastSnake, firstSnake); 

            }, 1000);*/

            //키보드값에 따라 제어, 반대편 입력하지 않은 경우에만 가능
            window.onkeydown = (e) => {
                if(e.code == 'ArrowUp' && snake.move != y){ snake.move = -y; }
                if(e.code == 'ArrowDown' && snake.move != -y){ snake.move = y; }
                if(e.code == 'ArrowLeft' && snake.move != 1){ snake.move = -1; }
                if(e.code == 'ArrowRight' && snake.move != -1){ snake.move = 1; }

                const snake_view_arr = document.querySelectorAll('[data-snake-table] [data-snake-snake]');
                const first_snake = snake_view_arr[0];//뱀의 머리
                const last_snake = snake_view_arr[snake_view_arr.length - 1];//뱀의 꼬리
                const move_snake = snake.snake_arr[0] + snake.move;
                const snake_x = snake.snake_arr[0] % x;
                const snake_y = Math.floor(snake.snake_arr[0] / y);

                //벽에 닿은 경우, 뱀의 몸에 닿은 경우 game over
                if( ( snake_x == (x - 1) && snake.move == 1 ) || ( snake_x == 0 && snake.move == -1 )
                    || ( snake_y == (y - 1) && snake.move == y ) || ( snake_y == 0 && snake.move == -y) 
                    || snake.snake_arr.includes(move_snake) ){
                    self.gameOver(); return false;
                }

                //실제 값 변경
                snake.snake_arr.unshift(move_snake);

                //사과 먹은 경우
                if(snake.snake_arr[0] == snake.apple_loaction){
                    self.loadSnake(snake.apple_loaction);
                    self.randomApple();
                }else{//먹지 않은 경우
                    //실제로 이동
                    if(snake.move == 1){ //오른쪽
                        last_snake.style.top = first_snake.style.top;
                        last_snake.style.left = (  Number(first_snake.style.left.replace('px', '')) + Number(snake.snake_size) ) + 'px';
                    }else if(snake.move == -1){ //왼쪽
                        last_snake.style.top = first_snake.style.top;
                        last_snake.style.left = (  Number(first_snake.style.left.replace('px', '')) - Number(snake.snake_size) ) + 'px';
                    }else if(snake.move == -y){ //위
                        last_snake.style.left = first_snake.style.left;
                        last_snake.style.top = (  Number(first_snake.style.top.replace('px', '')) - Number(snake.snake_size) ) + 'px';
                    }else if(snake.move == y){ //아래
                        last_snake.style.left = first_snake.style.left;
                        last_snake.style.top = (  Number(first_snake.style.top.replace('px', '')) + Number(snake.snake_size) ) + 'px';
                    }
                    snake.snake_table.insertBefore(last_snake, first_snake);
                    snake.snake_arr.length = snake.snake_arr.length - 1;
                }

            };


        },
        //게임오버 함수, 게임 초기화
        gameOver : function(){
            alert('gameOver');
            self.reloadSnake();
        }

    }
}();

snakeLoad.init();