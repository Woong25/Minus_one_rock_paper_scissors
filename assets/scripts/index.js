$level = 0;
$type = ['rock', 'peace', 'paper'];
$pc = ['rock', 'peace', 'paper'];

function getIndex(name){
    return $type.indexOf(name) + 1;
}

function getLevel(level){
    const type = ['choice', 'versus', 'result'];
    return type[level];
}
function getIcon(name, pc=false){
    return `<li><input type="radio" id="choice_${pc ? 'pc_inptu' : name}" name="choice_icon" readonly="${pc}" value="${name}"> <label for="choice_${pc ? 'pc_label' : name}"><i class="fas fa-hand-${name}"></i></label></li>`;
}
function game(type){
    $('.page').scrollTop(0);
    if($level === 1){
        const checked = $('.icon_choice input:checked');
        if(checked.length === 2){
            $('.icon_choice input:checked').each(function(){
                $('.icon_versus').append(getIcon($(this).attr('name')));
            })
            $pc = _.sampleSize($pc, 2);
            for(pc of $pc){
                $('.icon_versus_pc').append(getIcon(pc, true));
            }
        }else{
            alert('두가지 선택은 필수입니다.');
            $('#sec_choice .btn').addClass('hide');
            return false;
        }
    }else if($level === 2){
        let result;
        const selected = $('.icon_versus input:checked').val();
        const selected_pc = _.sample($pc);
        $('#sec_versus h1').html('대결 결과<br /><span></span>');
        $('#sec_versus .icons').addClass('sm');
        $('.icon_versus input:not(:checked)').parent().remove();
        $(`.icon_versus_pc input:not([value="${selected_pc}"])`).parent().remove();
        $('#sec_versus .btn').text('다시하기')
        
        const user = getIndex(selected)
        const pc = getIndex(selected_pc)
        const diff = Math.abs(pc - user);
        
        if(user === pc){
            result = '무승부';
            $('.icon_versus').addClass('lose')
        }else if(pc > user){
            if(diff === 1){
                result = '승리!';
            }else{
                result = '패배..';
                $('.icon_versus').addClass('lose')
                $('.icon_versus_pc').addClass('win')
            }
        }else if(pc < user){
            if(diff === 1){
                result = '패배..';
                $('.icon_versus').addClass('lose')
                $('.icon_versus_pc').addClass('win')
            }else{
                result = '승리!';
            }
        }
        $('#sec_versus h1 > span').text(result);
        $level = 'reset';
        return false;
    }else if($level === 'reset'){
        $level = 1;
        $pc = ['rock', 'peace', 'paper'];
        $('input').prop('checked', false);
        $('.btn').addClass('hide')
        $('section').removeClass('on');
        $('#sec_choice').addClass('on');
        $('#sec_versus h1').html('하나 빼기!<br /><span>한가지 선택</span>');
        $('#sec_versus .btn').text('대결')
        $('.icon_versus, .icon_versus_pc').html('').removeClass('win').removeClass('lose')

        return false;
    }

    $('section').removeClass('on');
    $('#sec_'+getLevel($level)).addClass('on');
    $level += 1;
}

$(function(){
    $('.icon_choice > li > input[type="checkbox"]').change(function(){
        const checked = $('.icons > li > input[type="checkbox"]:checked').length;
        if(checked >= 3){
            $('.icons > li > input[type="checkbox"]').not($(this)).prop('checked', false);
            $('#sec_choice .btn').addClass('hide');
        }else if(checked === 2){
            $('#sec_choice .btn').removeClass('hide');
        }else{
            $('#sec_choice .btn').addClass('hide');
        }
    });

    $('.icon_versus').on('change', 'li > input[type="radio"]', function(){
        $('#sec_versus .btn').removeClass('hide');
    })
});