/*
	note : 19年品牌佛山活动s2
	author : zx
	date : 2019-7-10
*/

var currentTimes = "";
var successFlag = "";
var netlink = 'http://back.foshanplus.com:8089';


$(document).ready(function(){


	//获取2期榜单内容
	get_S2_list();
	//设置滚动条控件高度
	setScrollheight();
	//校验当日投票次数
	checkTimes();
	//进度条控制
	stateControl();
	//基本按钮控制
	bindBasicBTNs();
	//个人信息提交
	confrimVoteAndUploadInfo();
	//投票控制
	finalVoteControl();
	//获取排行榜
	getRanks()
});


//滑动控件初始化

function initSlide(){

	var navSwiper = new Swiper('#header', {
        freeMode: true,
        slidesPerView: 'auto',
        freeModeSticky: true,
    });

    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 800,
        on: {
            slideChangeTransitionStart: function() {
                $(".tabs .active").removeClass('active');
                $(".tabs a").eq(this.activeIndex).addClass('active');
            }
        }
    })
    $(".tabs a").on('click', function(e) {
        e.preventDefault()
        $(".tabs .active").removeClass('active')
        $(this).addClass('active')
        tabsSwiper.slideTo($(this).index())
    })
}


window.onload = function() {
	initSlide();
}


function setScrollheight(){
	var availheight = window.screen.availHeight;
	var availwidth = window.screen.availWidth;

	//默认投票区域带滚动条的区域为屏幕可视高度的0.58
	$(".list-group").css("height", availheight*0.51);

	//默认投票区域外层容器区域为屏幕可视高度的0.6
	$("#tabs-container").css("height", availheight*0.55);

	//默认投票区域外层容器区域为屏幕可视高度的0.4
	$("#s2l1rank-content,#s2l2rank-content,#s2l3rank-content").css("height", availheight*0.4);

	if(availheight < 700){
		//ip6
		$("#introcontent").css("height", availheight*0.42);
	}else if((availheight > 670) && (availheight <700)){
		$("#introcontent").css("height", availheight*0.50);
		$(".list-group").css("height", availheight*0.55);
		$("#tabs-container").css("height", availheight*0.6);
	}else if(availheight > 700){
		$("#introcontent").css("height", availheight*0.50);
		$(".list-group").css("height", availheight*0.6);
		$("#tabs-container").css("height", availheight*0.65);
	}
}

function get_S2_list(){
	var availwidth = window.screen.availWidth;
	$.ajax({
		type:"get",
		url: netlink + "/exam/get_vote/?exam_id=10,11,12&openid=12345",
		dataType:"json",
		success:function(data){

			for (var i = 0; i < data.projects.length; i++){

				var s2listcontent = "";
				var s2modalcontent = "";
				for (var j = 0; j < data.projects[i].length; j++){
					if(availwidth < 350){
						if(i == 0){
							switch (j){
	  							case 12:
	  							case 18:
	  							case 20:
	  							case 22:
	  							case 41:
	  							case 46:
	  							case 56:
	  							case 57:
	  							case 59:
	  							case 61:
	  							case 66:
									var head = '<li class="list-group-item" style="height:75px">';
									var Num = '<p class="list-item-NumX">当前票数：' + data.projects[i][j].vote_count + '</p>';
									break;
								default:
									var head = '<li class="list-group-item">';
									var Num = '<p class="list-item-Num">当前票数：' + data.projects[i][j].vote_count + '</p>';
									break;
							}
						}else if(i == 1){
							switch (j){
								case 1:
	  							case 6:
	  							case 9:
	  							case 21:
	  							case 25:
	  							case 28:
	  							case 31:
	  							case 32:
	  							case 33:
	  							case 36:
	  							case 42:
	  							case 44:
	  							case 48:
	  								var head = '<li class="list-group-item" style="height:75px">';
									var Num = '<p class="list-item-NumX">当前票数：' + data.projects[i][j].vote_count + '</p>';
									break;
								default:
									var head = '<li class="list-group-item">';
									var Num = '<p class="list-item-Num">当前票数：' + data.projects[i][j].vote_count + '</p>';
									break;
							}
						}else if(i == 2){
							switch (j){
								case 1:
	  							case 16:
	  							case 21:
	  							case 31:
	  							case 34:
	  							case 39:
	  							case 42:
	  							case 45:
	  								var head = '<li class="list-group-item" style="height:75px">';
									var Num = '<p class="list-item-NumX">当前票数：' + data.projects[i][j].vote_count + '</p>';
									break;
								default:
									var head = '<li class="list-group-item">';
									var Num = '<p class="list-item-Num">当前票数：' + data.projects[i][j].vote_count + '</p>';
									break;
	  						}
						}
						var title = '<p class="list-item-titleS">' + data.projects[i][j].title + '</p>';
					}else{
						if((((i == 0) && ((j == 20) || (j == 46)))) || ((i == 1) && ((j == 9) || (j == 21) || (j == 25) || (j == 31) || (j == 33) || (j == 36) || (j == 48))) || ((i == 2) && ((j == 21) || (j == 34)))){
							var head = '<li class="list-group-item" style="height:75px">';
							var Num = '<p class="list-item-NumX">当前票数：' + data.projects[i][j].vote_count + '</p>';
						}else{
							var head = '<li class="list-group-item">';
							var Num = '<p class="list-item-Num">当前票数：' + data.projects[i][j].vote_count + '</p>';
						}
						var title = '<p class="list-item-title">' + data.projects[i][j].title + '</p>';
					}
					
					var order = '<div class="list-item-order">' + (j+1) + '</div>';
					var pic = '<div class="list-item-picholder" data-toggle="modal" data-target="#s2Info' + data.projects[i][j].id + '"><img class="list-item-picholder-in" src="' + data.projects[i][j].pic_url + '?imageView2/2/w/100/h/80/format/jpg/interlace/1/q/90"/></div>';
					var headx = '<div class="list-item-titleAndNumHolder">';
					/*var title = '<p class="list-item-title" data-toggle="modal" data-target="#s2Info' + data.projects[i][j].id + '">' + data.projects[i][j].title + '</p>';*/
					var checkbox = '<input onclick=stateControl("s2-list' + (i+1) + '-checkbox","tab' + (i+1) + '-state","s2-list' + (i+1) + '-state") type="checkbox" name="s2-list' + (i+1) + '-checkbox" class="fspCheckBox" value="' + data.projects[i][j].id + '" /></div>';
					var tailx = '</div>'

					if(j == data.projects[i].length-1){
						var tail = '</li><br/><div class="list-group-item btn btn-default confirmVote" onclick=voteControl()>投票&nbsp;<span class="glyphicon glyphicon-thumbs-up" style="top:3px;"></span></div><br/>';
					}else {
						var tail = '</li>';
					}
					
					s2listcontent += (head + order + pic + headx + title + Num +  checkbox + tailx + tail);
					
					var pics = '<div class="modal-picholder"><img class="modal-picholder-in" src="' + data.projects[i][j].pic_url + '?imageView2/2/w/100/h/80/format/jpg/interlace/1/q/90"/></div>'
					var modalhead = '<div data-backdrop="static" class="modal fade" id="s2Info' + data.projects[i][j].id + '" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">';
					var modalbody1 = '<div class="modal-body" style="padding:0;"><div class="form-group" style="text-align:center;"><div class="brand">' + pics + '</div><h4 style="color:#de5312;">' + data.projects[i][j].title + '</h4></div><div class="form-group">';
					var modalbody2 = '<div class="s1-details-modalcontent" style="text-align:justify;">' + data.projects[i][j].content + '</div></div></div><div class="modal-footer"><div style="color:#188ae2;" data-dismiss="modal">关闭</div></div>';
					var modaltail = '</div></div></div>';

					s2modalcontent += (modalhead + modalbody1 + modalbody2 + modaltail);
				}
				
				//填入到dom
				$('#s2List' + (i+1)).html(s2listcontent);
				$('#s2-details-modal' + (i+1)).html(s2modalcontent);
			}
		},
		error: function(){
            console.log('很抱歉，获取数据出错，请稍候再试！');
            alert("当前投票人数过多，请稍后重试get_S2_list()");
            return;
        }
     })
}


/*
 * note:每当有指定系列的checkbox选中，则检测当前状态以写入进度条
*/
function stateControl(name, num, scroll){

	var checkedItems = $('input[name=' + name + ']:checked');
	var uncheckedItems = $('input[name=' + name + ']:not(:checked)');
	var state = checkedItems.length;
	var stateByPercentform = 'width:' + state*10 + '%';
	if(state === 10){
		$('#' + num).html('已达投票上限');
		$('input[name=' + name + ']:not(:checked)').each(function(){
			$(this).attr('disabled',true);
		});
		var colorWarning = ';background-color:green;';
		$('#' + scroll).attr("style", stateByPercentform + colorWarning);
	}else if((state < 5) && (state > 0)){
		$('#' + num).html(state);
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
		var colorWarning = ';background-color:"#de5312;';
		$('#' + scroll).attr("style", stateByPercentform + colorWarning);
	}else if(state === 0){
		$('#' + num).html(state);
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
		var minlength = ';min-width:8px;width:0%;';
		$('#' + scroll).attr("style", stateByPercentform + minlength);
	}else if((state < 10) && (state > 4)){
		$('#' + num).html(state + '/10');
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
		var colorSuccess = ';background-color:green;';
		$('#' + scroll).attr("style", stateByPercentform + colorSuccess);
	}else if(state > 10){
		alert("当前榜单您最多选择10项");//这个不可能触发的
		return;
	}
}


function bindBasicBTNs(){
	/* 确认提交页面重新获取验证码的圆圈按钮 */
	$("#getnewcode").click(function(){
		getCodePic();
	});

	/*禁用轮播图自动播放*/
	$('#mycarousel').carousel({
		pause: true,
		interval: false
	});
}

/*  投票和信息登记的取消按钮，取消时清空已经填入的内容 */
function clearWastedInfo(item){
	$('#' + item).val("");
}

function voteControl(){
	checkTimes()
	var enable = currentTimes;
	if(enable === "can vote"){
		var s2l1num = $('input[name=s2-list1-checkbox]:checked').length;
		var s2l2num = $('input[name=s2-list2-checkbox]:checked').length;
		var s2l3num = $('input[name=s2-list3-checkbox]:checked').length;
		if((s2l1num < 5) || (s2l2num < 5) || (s2l3num < 5)){
			alert("您还未完成投票，每个榜单至少需要选择5项");
			return;
		}else{
			getCodePic();
			$('#votemodal').modal();
		}
	}else if(enable === "cannot vote"){
		alert("当日投票次数已达上限，请明天再来");
		return;
	}else{
		alert("当前服务器忙，请重试voteControl");
		return;
	}
}

function getCodePic(){
	$.ajax({
		type:"get",
		async:false,
		url: netlink + "/captcha",
		dataType:"json",
		success:function(data){
			var pic = 'data:image/png;base64,' + data.captcha.captcha_img;
			$("#picExam").attr("src", pic);
			$("#itemcodeID").val(data.captcha.item_id);
		},
		error: function(){
		    console.log('很抱歉，获取数据出错，请稍候再试！');
		    alert("当前服务器忙，请重试getCodePic");
		}
	});
}

/* 判断当前用户是否已经达到当天投票上限 */
function checkTimes(){
	var usropenid = getParam('openid');
	var currrent = getCurrentDate();
	$.ajax({
		type:"get",
		async:true,
		url: netlink + '/examlog/?exam=10&created_gte=' + currrent + '&openid=' + usropenid,
		dataType:"json",
		success:function(data){
			var times = data.results.length;
			if(times < 2){
				currentTimes = "can vote";
			}else if((times > 2) || (times === 2)){
				currentTimes = "cannot vote";
			}else {
				return;
			}
		},
		error: function(){
		    console.log('很抱歉，获取用户当日参加活动次数出错，请稍候再试！');
		    alert("当前服务器忙，请重试checkTimes");
		}
	});
}


/* 获取url参数 */
function getParam(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}


/* 获取当前日期 */
function getCurrentDate(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/* 判断是否登记了个人信息，若没有，则弹出框要求用户提交个人信息 */
function checkSigned(){
	var usropenid = getParam('openid');
	$.ajax({
		type:"get",
		async:false,
		url: netlink + '/wxusers/?openid=' + usropenid + '&name=&phone=',
		dataType:"json",
		success:function(data){
			var flag = data.count;
			var name = data.results.name;
			var phone = data.results.phone;
			/*首次登陆的需要登记*/
			if(flag === 0){
				alert("请填写个人信息");
				/*首次登陆用户不会有已经选择的项目，所以跳转至验证码的提交按钮隐藏，只显示过程中的提交按钮*/
				$("#getuserinfomodal").modal();
				return;
			/*非首次登陆但是没有登记信息的也需要登记*/
			}else if((flag > 0) && ((name === "") || (phone === ""))){		
				alert("请填写个人信息");	
				$("#getuserinfomodal").modal();
				return;
			}else{
				/* 当用户完成个人信息填写就不做弹出的操作了 */
				successFlag = 'userSigned';
				window.location.href = 'http://back.foshanplus.com:8089/static/FoShanBrandS2/index.html?openid=' + usropenid;
			}
		},
		error: function(){
		    console.log('很抱歉，获取用户openid出错，请稍候再试！');
		    alert("当前服务器忙，请重试checkSigned");
		}
	});
}

function finalVoteControl(){
	$("#voteFinalConfrim").click(function(){
		var usropenid = getParam('openid');
		var item_id = $("#itemcodeID").val();//正确验证码
		var code = $("#usersetcode").val();//用户输入
		if(code == ""){
			alert("请输入验证码");
			return;
		}

		var s2l1checked = [];
		var s2l2checked = [];
		var s2l3checked = [];
		var vote_list = [];
		$('input[name=s2-list1-checkbox]:checked').each(function(i){
			s2l1checked[i] = $(this).val();
		});

		$('input[name=s2-list2-checkbox]:checked').each(function(i){
			s2l2checked[i] = $(this).val();
		});

		$('input[name=s2-list3-checkbox]:checked').each(function(i){
			s2l3checked[i] = $(this).val();
		});

		vote_list = s2l1checked.concat(s2l2checked);//用户选择
		vote_list = s2l3checked.concat(vote_list);
		console.log(vote_list);
		var url = netlink + '/exam/add_vote_pro/?exam_id=10,11,12&openid=' + usropenid + '&item_id=' + item_id + '&code=' + code + '&vote_list=' + vote_list;
		$.ajax({
			type:"get",
			async:false,
			url:url,
			dataType:"json",
			success:function(data){
				var msg = data.msg;
				var res = data.is_error;
				// console.log(res)
				if(data.is_error == false){
					//投票成功提示
					alert(msg);
					//判断是否已经提交过个人信息
					checkSigned();
				}else if(data.is_error == true){

					if(data.msg == "验证码错误"){
						alert(msg);
						$("#usersetcode").val("");
						var pic = 'data:image/png;base64,' + data.data.captcha.captcha_img;
						$("#picExam").attr("src", pic);
						$("#itemcodeID").val(data.data.captcha.item_id);
					}else{
						alert(msg);
						window.location.href = 'http://back.foshanplus.com:8089/static/FoShanBrandS2/index.html?openid=' + usropenid;
					}
				}
				
			},
			error: function(){
			    console.log('很抱歉，获取用户当日参加活动次数出错，请稍候再试！');
			    alert("当前服务器忙，请重试checkTimes");
			}
		});
	});
	
}


function giveUpAward(){
	var usropenid = getParam('openid');
	window.location.href = 'http://back.foshanplus.com:8089/static/FoShanBrandS2/index.html?openid=' + usropenid;
}


/* 个人信息 */
function confrimVoteAndUploadInfo(){
	$("#uploadinfo-final").click(function(){
		signIn();
	});
}

function signIn(){
	var usropenid = getParam('openid');
	var name = $("#username").val();
	var phone = $("#userphone").val();
	if((name === "") || (phone === "")){
		alert("请填写完整");
		return;
	}
	$.ajax({
		type:"post",
		async:false,
		url: netlink + '/wxusers/',
		data:{"openid":usropenid,"name":name,"phone":phone},
/*		dataType:"json",*/
		success:function(data){
			alert("参与成功！请等待开奖");
			window.location.href = 'http://back.foshanplus.com:8089/static/FoShanBrandS2/index.html?openid=' + usropenid;
		},
		error: function(){
		    console.log('很抱歉，提交用户信息错误，请稍候再试！');
		    alert("当前服务器忙，请重试signIn");
		}
	});
}


function getRanks(){
	$.ajax({
		type:"get",
		async:false,
		url:netlink + '/exam/get_vote_rank/?exam_id=10,11,12&top=10',
		dataType:"json",
		success:function(data){
			for(var p = 0; p < data.length; p++){
				var s2lxrank = "";
				var line = '';
				for(var i = 0; i < data[p].votes.length; i++){
					if(i == 0){
						line = '<tr><td class="rankNum" width="14%"><span><img class="rankAwards" src="img/1.png"/></span></td><td width="86%" class="rankTitle">&nbsp;' + data[p].votes[i].title + '</td>';
					}else if(i == 1){
						line = '<tr><td class="rankNum" width="14%"><span><img class="rankAwards" src="img/2.png"/></span></td><td width="86%" class="rankTitle">&nbsp;' + data[p].votes[i].title + '</td>';
					}else if(i == 2){
						line = '<tr><td class="rankNum" width="14%"><span><img class="rankAwards" src="img/3.png"/></span></td><td width="86%" class="rankTitle">&nbsp;' + data[p].votes[i].title + '</td>';
					}else{
						line = '<tr><td class="rankNum" width="14%">' + (i+1) + '</td><td width="86%" class="rankTitle">&nbsp;' + data[p].votes[i].title + '</td>';
					}
					s2lxrank += line;
				}
				$('#s2l' + (p+1) + 'rank').html(s2lxrank);
			}
		},
		error: function(){
		    console.log('很抱歉，获取排行榜失败，请稍候再试！');
		    alert("当前服务器忙，请重试signIn");
		}
	});
}
