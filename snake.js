// 스네이크 게임 불러오기
// 좌표 계산 방법
// y좌표 * map_width + x좌표
// 0,0이 첫 시작 왼쪽으로 0,1 아래로 1,0
const SnakeLoad = function () {

    const map_width = 17, map_height = 17;
    let self;

    // move : 이동 값, 1 : right, -1 : left, -map_hieght : up, map_height : down
    // default > 1
    // snake_location_arr : 뱀 위치 배열, 뱀 꼬리 추가 시 배열 추가
    const snake = {
        snake_map_selector : document.querySelector('[data-snake-map]'),
        snake_selector : document.querySelector('[data-snake]'),
        apple_selector : document.querySelector('[data-apple]'),
        score_selector : document.querySelector('[data-now]'),
        snake_size : window.getComputedStyle(document.querySelector('[data-snake]')).width.replace('px', ''),
        move : 1,
        apple_loaction : 0,
        snake_location_arr : [],
        isStart : false,
        interval : null,
        speed : 400,
        max_speed : 200, 
    };
    return {
        init: function () {
            self = this;

            //====================================================
            // 랜덤으로 크기가 제대로 인식되지 않아 맵이 이상하게 생성되는 버그가 있음
            // 해당 버그 수정 용도
            //====================================================
            if(snake.snake_size > 100) location.reload();
            
            //스네이크 맵 세팅
            self.initSnakeMap();
            
            //사과 랜덤
            self.randomApple();

            //스네이크 게임 버튼 동작
            self.snakeGameBtn();

            //스네이크 동작
            self.controlSnake();

        },
        //스네이크 맵 세팅
        initSnakeMap : function(){

            //맵 크기를 조절한다(snake_size * map_size)
            document.querySelector('.box-top-wrap').style.width = snake.snake_size * map_width + 'px';
            document.querySelector('.box-bottom-wrap').style.width = snake.snake_size * map_width + 'px';
            document.querySelector('.box-bottom-wrap').style.height = snake.snake_size * map_height + 'px';

            //기존 점수가 있다면 점수 불러옴
            const best_score = localStorage.getItem('score');
            const best_score_selector = document.querySelectorAll('[data-best]')
            if(best_score) [... best_score_selector].map(ele => ele.innerHTML = best_score);

            //스네이크 보여주기
            self.loadSnake();

        },
        //스네이크 초기화
        loadSnake : function(){
            //스네이크 얼굴 초기화
            snake.snake_map_selector.className = 'right';

            //스네이크 뿌릴 위치
            const center_x = Math.ceil(map_width/ 4) - 1 ;
            const center_y = Math.ceil(map_height/ 2) - 1 ;
            snake.snake_location_arr = [ center_y * map_height + center_x ];
           
            //초기화
            snake.move = 1;
            snake.score_selector.innerHTML = 0;
            document.querySelectorAll('[data-snake-map] [data-snake]').forEach((elem) => elem.remove());;

            //화면에 뱀의 몸을 추가해준다
            self.addSnakeBody(snake.snake_location_arr[0]);
        },
        //뱀의 몸통이 추가되는 경우
        addSnakeBody : function(location){    
            const snake_clone_node = snake.snake_selector.cloneNode(true);
            snake_clone_node.style.top = snake.snake_size * ( Math.floor(location / map_height) ) + 'px';
            snake_clone_node.style.left = snake.snake_size * ( location % map_width ) + 'px';
            snake_clone_node.classList.remove("hide");
            snake.snake_map_selector.prepend(snake_node);
        },
        //사과 랜덤
        randomApple : function(){
            const apple_x = Math.floor(Math.random() * map_width);
            const apple_y = Math.floor(Math.random() * map_height);
            const apple_random_location = apple_y * map_height + apple_x;

            //스네이크에 닿는 경우 재호출
            if(snake.snake_location_arr.includes(apple_random_location)){ self.randomApple(); return false; } 

            snake.apple_selector.style.top = snake.snake_size * apple_y + 'px';        
            snake.apple_selector.style.left = snake.snake_size * apple_x + 'px';

            //apple_location 설정
            snake.apple_loaction = apple_random_location;
        },
        //스네이크 컨트롤
        controlSnake : function(){

            //키보드값에 따라 제어, 반대편 입력하지 않은 경우에만 가능
            window.onkeydown = (e) => {

                if(e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowLeft' || e.code == 'ArrowRight'){

                    //게임이 종료되었을 경우 더이상 움직이지 않게 지정
                    if(!snake.isStart) return false;

                    if(e.code == 'ArrowUp' && Math.abs(snake.move) != map_height){ snake.move = -map_height; snake.snake_map_selector.className = 'up';}
                    else if(e.code == 'ArrowDown' && Math.abs(snake.move) != map_height){ snake.move = map_height; snake.snake_map_selector.className = 'down'; }
                    else if(e.code == 'ArrowLeft' && Math.abs(snake.move) != 1){ snake.move = -1; snake.snake_map_selector.className = 'left';}
                    else if(e.code == 'ArrowRight' && Math.abs(snake.move) != 1){ snake.move = 1; snake.snake_map_selector.className = 'right'; }
                    else{ return false;}
                    
                    //뱀의 실제 이동
                    //방향키를 누른 경우 interval을 초기화 한 후 다시 실행해준다.
                    self.moveSnake();
                    clearInterval(snake.interval);
                    snake.interval = setInterval(self.moveSnake, snake.speed);
                
                }

            };

        },
        //스네이크의 실제 동작
        moveSnake : function(){

            const snake_selector_arr = document.querySelectorAll('[data-snake-map] [data-snake]');
            const first_snake = snake_selector_arr[0];//뱀의 머리
            const last_snake = snake_selector_arr[snake_selector_arr.length - 1];//뱀의 꼬리
            const move_snake = snake.snake_location_arr[0] + snake.move;
            const snake_x = snake.snake_location_arr[0] % map_width;
            const snake_y = Math.floor(snake.snake_location_arr[0] / map_height);

            //벽에 닿은 경우, 뱀의 몸에 닿은 경우 game over
            if( ( snake_x == (map_width - 1) && snake.move == 1 ) || ( snake_x == 0 && snake.move == -1 )
                || ( snake_y == (map_height - 1) && snake.move == map_height ) || ( snake_y == 0 && snake.move == -map_height) 
                || snake.snake_location_arr.includes(move_snake) ){
                snake.snake_map_selector.className += ' die';
                clearInterval(snake.interval);
                self.gameOver();
                return false;
            }

            //실제 값 변경
            snake.snake_location_arr.unshift(move_snake);

            //사과 먹은 경우
            //사과 랜덤으로 노출 후 점수 증가, 속도증가
            if(snake.snake_location_arr[0] == snake.apple_loaction){
                
                self.addSnakeBody(snake.apple_loaction);
                self.randomApple();

                //점수 카운팅
                snake.score_selector.innerHTML = Number(snake.score_selector.innerText) + 1 ;
                //속도 증가
                if(snake.max_speed > snake.speed){
                    snake.speed -= 10;
                }
                //interval 재시작
                clearInterval(snake.interval);
                snake.interval = setInterval(self.moveSnake, snake.speed);

            //먹지 않은 경우
            //실제로 뱀이 움직이는 모습을 보여줌, 실제 값 변경
            }else{
                //실제로 이동
                if(snake.move == 1){ //오른쪽
                    last_snake.style.top = first_snake.style.top;
                    last_snake.style.left = (  Number(first_snake.style.left.replace('px', '')) + Number(snake.snake_size) ) + 'px';
                }else if(snake.move == -1){ //왼쪽
                    last_snake.style.top = first_snake.style.top;
                    last_snake.style.left = (  Number(first_snake.style.left.replace('px', '')) - Number(snake.snake_size) ) + 'px';
                }else if(snake.move == -map_height ){ //위
                    last_snake.style.left = first_snake.style.left;
                    last_snake.style.top = (  Number(first_snake.style.top.replace('px', '')) - Number(snake.snake_size) ) + 'px';
                }else if(snake.move == map_height){ //아래
                    last_snake.style.left = first_snake.style.left;
                    last_snake.style.top = (  Number(first_snake.style.top.replace('px', '')) + Number(snake.snake_size) ) + 'px';
                }
                //실제 값 변경
                snake.snake_map_selector.insertBefore(last_snake, first_snake);
                snake.snake_location_arr.pop();
            }
            
        },
        //게임오버 함수, 게임 초기화, 최고 점수 설정
        gameOver : function(){
            //최고 점수 세팅
            const best_score = localStorage.getItem('score');
            const now_score = Number(snake.score_selector.innerText);
            document.querySelector('[data-end-score]').innerHTML = now_score;
            if( !best_score || best_score < now_score ){
                localStorage.setItem('score', now_score);
                [... document.querySelectorAll('[data-best]')].map(ele => ele.innerHTML = now_score);
            }
            //시작값 초기화
            snake.isStart = false;
            clearInterval(snake.interval);
            //gameover 화면 노출
            document.querySelector('.game-over-overlay').style.display = 'block';
        },
        //스네이크 게임 버튼 동작 함수 모음
        snakeGameBtn : function(){
            const startBtn = document.querySelector('[data-start]');
            const restartBtn = document.querySelector('.game-over-overlay button');

            startBtn.addEventListener('click', () => {
                //시작하지 않았다면 동작할 수 있도록
                if(!snake.isStart){
                    //스네이크 동작
                    snake.isStart = true;
                    snake.interval = setInterval(self.moveSnake, snake.speed);
                }
            });

            //뱀을 시작 전으로 초기화한다(시작 버튼 누르기 전)
            restartBtn.addEventListener('click', () => {
                //gameover 화면 숨기기
                document.querySelector('.game-over-overlay').style.display = 'none';
                //뱀 초기화
                self.loadSnake();
            });
        },
    }
}();

SnakeLoad.init();