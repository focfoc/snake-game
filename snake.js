//스네이크 게임 불러오기
const snakeLoad = function () {
    //맵생성 x = width , y = height
    const x = 17, y = 17;
    const snake_table = document.querySelector('[data-snake-table]');
    let self;
    const snake = {
        snake_arr : '',
    };
    return {
        init: function () {
            self = this;
            
            //스네이크 게임 맵 생성 x * y
            self.loadMap();
            
            //스네이크 세팅
            self.initSnake();
            
            //사과 랜덤
            self.randomApple();
            
            //스네이크 동작
            self.moveSnake();
        },
        //스네이크 게임 맵 생성
        loadMap : function(){
            const snake = '<div data-snake-snake></div>';
            const apple = '<div data-apple></div>';
            let append_txt = '';
            let td_txt = '';

            //tr 만들기
            for(let i=0; i < x; i++){
                append_txt += `<div>`;
                
                //td 만들기
                for(let j=0; j<y; j++){
                    append_txt += `<div data-x=${i} data-y=${j}></div>`;
                }

                append_txt += `</div>`;
            }
            append_txt += snake;
            append_txt += apple;
            
            snake_table.innerHTML = append_txt;

            //스네이크 맵 꾸미기(div에 width값을 줘서 흰색 테두리를 준다)
            const snake_table_width = window.getComputedStyle(snake_table).width;
            document.querySelector('.box-top').style.width = snake_table_width;
            document.querySelector('.box-bottom').style.width = snake_table_width;

        },
        //스네이크 세팅
        initSnake : function(){
            const cell_width = snake_table.clientWidth / x;
            const cell_height = snake_table.clientHeight / y; 

            //snake에 움직일 값, 전체 길이를 담아준다
            snake.width = snake_table.clientWidth;
            snake.height = snake_table.clientHeight;
            //움직일 값
            snake.cell_width = cell_width;
            snake.cell_height = cell_height;

            //스네이크 보여주기
            self.loadSnake();

        },
        //스네이크 보여주기
        loadSnake : function(){
            const center_x = Math.ceil(x/ 4) ;
            const center_y = Math.ceil(y/ 2) ;

            //화면에 뿌려주기
            const snake_view = document.querySelector('[data-snake-snake]');
            snake_view.style.top = snake.cell_height * ( center_y - 1 ) + 'px';        
            snake_view.style.left = snake.cell_width * ( center_x - 1 ) + 'px';

        },
        //사과 랜덤
        randomApple : function(){
            const apple = document.querySelector('[data-apple]');

            apple.style.top = snake.cell_height * ( Math.floor(Math.random() * y) ) + 'px';        
            apple.style.left = snake.cell_width * ( Math.floor(Math.random() * x) ) + 'px';

        },
        //스네이크 움직이기
        moveSnake : function(){
            const snake_view = document.querySelector('[data-snake-snake]');

            window.onkeydown = (e) => {

                if(e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowLeft' || e.code == 'ArrowRight'){
                    
                    const top_px = Number(snake_view.style.top.replace('px', ''));
                    const left_px = Number(snake_view.style.left.replace('px', ''));
                    let move_top_px = top_px, move_left_px = left_px;

                    if(e.code == 'ArrowUp'){
                        move_top_px = top_px - snake.cell_height;
                    }
                    if(e.code == 'ArrowDown'){
                        move_top_px = top_px + snake.cell_height;
                    }
                    if(e.code == 'ArrowLeft'){
                        move_left_px = left_px - snake.cell_width;
                    }
                    if(e.code == 'ArrowRight'){
                        move_left_px= left_px + snake.cell_width ;
                    }

                    if(snake.width <= move_left_px || snake.height <= move_top_px || 
                        0 > move_left_px || 0 > move_top_px ){
                        alert('game over');
                        //스네이크 보여주기
                        self.loadSnake();
                        return false;
                    }

                    snake_view.style.top = move_top_px + 'px';
                    snake_view.style.left = move_left_px + 'px';

                }
                

            };


        }

    }
}();

snakeLoad.init();